import { defineEventHandler } from 'h3'
import { useSafeValidatedParams, z } from 'h3-zod'
import { getUserById } from '~~/server/domain/user/eventHandling'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await useSafeValidatedParams(event, {
    id: z.string()
  })

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const user = await getUserById(eventStore, validatedParams.id)

    return user
  }
  catch (error) {
    console.error('Failed to get events', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get events'
    })
  }
})
