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

    const [Users, total] = await Promise.all([
      getUsersPaginated(eventStore, offset, limit),
      getUserCount(eventStore)
    ])

    return {
      data: Users,
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
