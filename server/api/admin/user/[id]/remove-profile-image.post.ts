import { defineEventHandler, createError } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { useSafeValidatedBody, z } from 'h3-zod'
import { removeProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import type { RemoveProfileImage } from '~~/server/domain/user/commandHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const user = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate request body
  // =============================================================================
  const removeProfileImageSchema = z.object({
    userId: z.string()
  })

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    removeProfileImageSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Handle Command
  // =============================================================================
  const eventStore = event.context.eventStore
  const command: RemoveProfileImage = createCommand({
    type: 'RemoveProfileImage',
    data: {
      userId: validatedData.userId
    },
    metadata: {
      requestedBy: {
        email: user.email,
        userId: user.sub
      }
    }
  })

  try {
    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(validatedData.userId)
      }],
      commandHandlerFunction: removeProfileImage,
      command: command
    })

    const { minioClient } = useMinio()
    const { storage: { s3: { bucket } } } = useRuntimeConfig()
    minioClient.removeObject(bucket, `profile/${validatedData.userId}`).catch((removeError) => {
      console.error('Error removing object:', removeError)
    })
    return {
      ...result
    }
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating event'
    })
  }
})
