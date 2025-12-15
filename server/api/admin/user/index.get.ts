import type { UserServiceUser } from '@zitadel/zitadel-node/dist/models/user-service-user'
import { defineEventHandler } from 'h3'
import { getUserCount, getUsersPaginated } from '~~/server/domain/user/eventHandling'
import type { User } from '~~/shared/validation/userSchema'
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

    const userDetails = await idpClient.users.listUsers({
      userServiceListUsersRequest: {
        queries: [{
          inUserIdsQuery: { userIds: userIds }
        }] }
    })

    const mergedUsers: User[] = users.map((user) => {
      if (!userDetails.result) {
        throw new Error('Failed to fetch user details from Zitadel')
      }
      const details = userDetails.result.find((userDetail: UserServiceUser) => userDetail.userId === user.id)
      if (!details) {
        throw new Error('Failed to fetch user details from Zitadel')
      }
      return {
        userId: user.id,
        givenName: details.human?.profile?.givenName || '',
        familyName: details.human?.profile?.familyName || '',
        email: {
          email: details.human?.email?.email || '',
          isVerified: details.human?.email?.isVerified || false
        },
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
