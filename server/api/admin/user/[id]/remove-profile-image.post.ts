import { createCommand, handleCommand } from 'vorfall'
import { z } from 'zod'
import { removeProfileImage } from '~~/server/domain/user/commandHandling'
import { evolve, getUserById, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'
import type { RemoveProfileImage } from '~~/server/domain/user/commandHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const user = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate
  // =============================================================================

  const removeProfileImageSchema = z.object({ id: z.string() })
  const params = await useValidatedParams(event, removeProfileImageSchema)

  // =============================================================================
  // Get profile image from user
  // =============================================================================

  const rbagUser = await getUserById(event.context.eventStore, params.id)
  const profileImage = rbagUser?.projections.User.media?.profileImage.objectName

  if (!profileImage) {
    // When no profile image, we don't need to do anything
    return sendNoContent(event)
  }

  // =============================================================================
  // Handle Command
  // =============================================================================
  const eventStore = event.context.eventStore
  const command: RemoveProfileImage = createCommand({
    type: 'RemoveProfileImage',
    data: {
      userId: params.id,
      profileImageObjectName: profileImage
    },
    metadata: {
      requestedBy: {
        email: user.email,
        userId: user.sub
      }
    }
  })

  try {
    await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(params.id)
      }],
      commandHandlerFunction: removeProfileImage,
      command: command
    })

    const { minioClient } = useMinio()
    const bucket = useRuntimeConfig().storage.s3.bucket
    minioClient.removeObject(bucket, profileImage).catch((removeError) => {
      console.error('Error removing object:', removeError)
    })
    return sendNoContent(event)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating event'
    })
  }
})
