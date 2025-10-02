import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { z } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { attachProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import type { AttachProfileImage } from '~~/server/domain/user/commandHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const authUser = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate
  // =============================================================================
  const setProfileImageSchema = z.object({
    userId: z.string(),
    uploadedFileKey: z.string()
  })

  const body = await useValidatedBody(event, setProfileImageSchema)

  // =============================================================================
  // Remove old profile image if exists
  // =============================================================================

  await event.$fetch('/api/admin/user/:id/remove-profile-image'.replace(':id', body.userId), {
    method: 'POST',
    body: {
      userId: body.userId
    }
  }).catch((error) => {
    console.error('Error removing old profile image:', error)
  })

  // =============================================================================
  // Copy data to final destination
  // =============================================================================
  const { minioClient } = useMinio()

  const bucket = useRuntimeConfig().storage.s3.bucket
  const tempBucket = useRuntimeConfig().storage.s3.tempBucket
  const sourceKeyWithBucket = `/${tempBucket}/${body.uploadedFileKey}`
  const destinationKey = randomUUID()

  try {
    await minioClient.copyObject(bucket, destinationKey, sourceKeyWithBucket)
    await minioClient.removeObject(tempBucket, body.uploadedFileKey)
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

  const command: AttachProfileImage = createCommand({
    type: 'AttachProfileImage',
    data: {
      userId: body.userId,
      profileImageObjectName: destinationKey
    },
    metadata: {
      requestedBy: {
        email: authUser.email,
        userId: authUser.sub
      }
    }
  })

  try {
    const eventStore = event.context.eventStore
    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(body.userId)
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
