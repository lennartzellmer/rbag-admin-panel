import { defineEventHandler } from 'h3'
import { getUserCount, getUsers } from '~~/server/domain/user/eventHandling'
import { useValidatedQuery } from '~~/server/utils/useValidated'
import type { PaginationResponseSchema } from '~~/shared/validation/paginationQuerySchema'
import { paginationQuerySchema } from '~~/shared/validation/paginationQuerySchema'
import { enrichUsers } from '~~/server/utils/useZitadel'
import type { User } from '~~/shared/validation/userSchema'
import z from 'zod'

export default defineEventHandler(async (event): Promise<PaginationResponseSchema<User>> => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const schema = z.union([
    paginationQuerySchema,
    z.object({})
  ])

  const query = await useValidatedQuery(event, schema)

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const [users, total] = await Promise.all([
      getUsers(eventStore, query ? { skip: query.offset, limit: query.limit } : undefined),
      getUserCount(eventStore)
    ])

    const idpClient = event.context.idpClient

    const usersWithDetailsAndRoles = await enrichUsers(idpClient, users)

    return {
      data: usersWithDetailsAndRoles,
      meta: {
        total,
        offset: query?.offset ?? 0,
        limit: query?.limit ?? total
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
