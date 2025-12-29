import { defineEventHandler } from 'h3'
import { getUserCount, getUsersPaginated } from '~~/server/domain/user/eventHandling'
import { useValidatedQuery } from '~~/server/utils/useValidated'
import type { PaginationResponseSchema } from '~~/shared/validation/paginationQuerySchema'
import { paginationQuerySchema } from '~~/shared/validation/paginationQuerySchema'
import { enrichWithUserDetails, enrichWithUserRoles } from '~~/server/utils/useZitadel'
import type { User } from '~~/shared/validation/userSchema'

export default defineEventHandler(async (event): Promise<PaginationResponseSchema<User>> => {
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

    const idpClient = event.context.idpClient

    const usersWithDetails = await enrichWithUserDetails(idpClient, users)

    const usersWithDetailsAndRoles = await enrichWithUserRoles(idpClient, usersWithDetails)

    return {
      data: usersWithDetailsAndRoles,
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
