import { defineEventHandler } from 'h3'
import { z } from 'h3-zod'
import { getUserById } from '~~/server/domain/user/eventHandling'
import { cachedPresignedUrl } from '~~/server/utils/cachedPresignedUrl'
import { useValidatedParams } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const validatedParams = await useValidatedParams(event, z.object({
    id: z.string(),
    presignedMedia: z.boolean().default(true)
  }))

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const user = await getUserById(eventStore, validatedParams.id)

    const media = user?.projections.User?.media

    if (validatedParams.presignedMedia && media) {
      const test = await cachedPresignedUrl(media.profileImage)
      media.profileImage = test
    }

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
