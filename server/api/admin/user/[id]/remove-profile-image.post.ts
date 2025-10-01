import { defineEventHandler, createError } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { z } from 'h3-zod'
import { removeProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import type { RemoveProfileImage } from '~~/server/domain/user/commandHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const user = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate
  // =============================================================================

  const removeProfileImageSchema = z.object({
    userId: z.string()
  })

  const body = await useValidatedBody(event, removeProfileImageSchema)

  // =============================================================================
  // Handle Command
  // =============================================================================
  const eventStore = event.context.eventStore
  const command: RemoveProfileImage = createCommand({
    type: 'RemoveProfileImage',
    data: {
      userId: body.userId
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
        streamSubject: getUserStreamSubjectById(body.userId)
      }],
      commandHandlerFunction: removeProfileImage,
      command: command
    })

    const { minioClient } = useMinio()
    const { storage: { s3: { bucket } } } = useRuntimeConfig()
    minioClient.removeObject(bucket, `profile/${body.userId}`).catch((removeError) => {
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
