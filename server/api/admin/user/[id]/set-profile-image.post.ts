import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody, z } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { attachProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import type { AttachProfileImage } from '~~/server/domain/user/commandHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const authUser = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate request body
  // =============================================================================
  const setProfileImageSchema = z.object({
    userId: z.string(),
    uploadedFileKey: z.string()
  })

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    setProfileImageSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Copy data to final destination
  // =============================================================================
  const { minioClient } = useMinio()
  const { storage: { s3: { bucket, tempBucket } } } = useRuntimeConfig()

  const sourceKeyWithBucket = `/${tempBucket}/${validatedData.uploadedFileKey}`
  const destinationKey = `profile/${randomUUID()}`

  try {
    await minioClient.copyObject(bucket, destinationKey, sourceKeyWithBucket)
    await minioClient.removeObject(tempBucket, validatedData.uploadedFileKey)
  }
  catch (error) {
    console.error('Error copying object to final destination:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing image'
    })
  }

  // =============================================================================
  // Handle Command
  // =============================================================================

  const eventStore = event.context.eventStore

  const command: AttachProfileImage = createCommand({
    type: 'AttachProfileImage',
    data: {
      userId: validatedData.userId,
      profileImageKey: destinationKey
    },
    metadata: {
      requestedBy: {
        email: authUser.email,
        userId: authUser.sub
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
      commandHandlerFunction: attachProfileImage,
      command: command
    })

    return {
      ...result
    }
  }
  catch (error) {
    minioClient.removeObject(bucket, destinationKey).catch((removeError) => {
      console.error('Error removing object after command failure:', removeError)
    })
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating event'
    })
  }
})
