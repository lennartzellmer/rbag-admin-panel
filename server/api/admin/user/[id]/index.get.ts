import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { getUserById } from '~~/server/domain/user/eventHandling'
import { useValidatedParams } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
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

    return user?.projections.User
  }
  catch (error) {
    console.error('Failed to get events', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get events'
    })
  }
})
