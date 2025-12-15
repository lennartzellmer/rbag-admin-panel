import { defineEventHandler } from 'h3'
import { getUserCount, getUsersPaginated } from '~~/server/domain/user/eventHandling'
import { useValidatedQuery } from '~~/server/utils/useValidated'
import { paginationQuerySchema } from '~~/shared/validation/paginationQuerySchema'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const { offset, limit } = await useValidatedQuery(event, paginationQuerySchema)

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const [users, total] = await Promise.all([
      getUsersPaginated(eventStore, offset, limit),
      getUserCount(eventStore)
    ])

    const userIds = users.map(user => user.id)

    const idpClient = event.context.idpClient
    const userDetails = await idpClient.listUsers(
      {
        queries: [{
          inUserIdsQuery: { userIds: userIds }
        }]
      })

    const mergedUsers = users.map((user) => {
      const details = userDetails.result.find(userDetail => userDetail.id === user.id)
      return {
        ...details,
        profileImage: user.media?.profileImage
      }
    })

    return {
      data: mergedUsers,
      meta: {
        total,
        offset,
        limit
      }
    }
  }

  catch (error) {
    console.error('Failed to get events', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get events'
    })
  }
})
