import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody, z } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { attachProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import { federatedUserSchema } from '~~/server/domain/user/validation'
import type { AttachProfileImage } from '~~/server/domain/user/commandHandling'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const { user } = await getUserSession(event)

  const {
    success: isValidUser,
    error: userValidationError,
    data: validatedUserData
  } = await federatedUserSchema.safeParse(user)

  if (!isValidUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data',
      statusText: userValidationError?.message
    })
  }

  // =============================================================================
  // Parse and validate request body
  // =============================================================================
  const setProfileImageSchema = z.object({
    userId: z.string().uuid(),
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
  const { minioClient, bucket } = useMinio()

  const finalDestinationKey = `/${bucket}/profile/${randomUUID()}`

  try {
    await minioClient.copyObject(bucket, validatedData.uploadedFileKey, finalDestinationKey)
    await minioClient.removeObject(bucket, validatedData.uploadedFileKey)
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
      profileImageKey: finalDestinationKey
    },
    metadata: {
      requestedBy: {
        email: validatedUserData.email,
        userId: validatedUserData.sub
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
    minioClient.removeObject(bucket, finalDestinationKey).catch((removeError) => {
      console.error('Error removing object after command failure:', removeError)
    })
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating event'
    })
  }
})
