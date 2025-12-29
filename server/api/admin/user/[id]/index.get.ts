import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { getUserById } from '~~/server/domain/user/eventHandling'
import { useValidatedParams } from '~~/server/utils/useValidated'
import { enrichUsers } from '~~/server/utils/useZitadel'
import type { User } from '~~/shared/validation/userSchema'

export default defineEventHandler(async (event): Promise<User> => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const validatedParams = await useValidatedParams(event, z.object({
    id: z.string()
  }))

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const user = await getUserById(eventStore, validatedParams.id)

    if (!user?.projections.User) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    const idpClient = event.context.idpClient

    const [userWithDetailsAndRoles] = await enrichUsers(idpClient, [user?.projections.User])

    return userWithDetailsAndRoles
  }
  catch (error) {
    console.error('Failed to get events', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get events'
    })
  }
})
