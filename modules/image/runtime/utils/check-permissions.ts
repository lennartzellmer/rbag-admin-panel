import type { H3Event } from 'h3'
import { getMediaByKey, MediaProjectionName } from '~~/server/domain/media/eventHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export const checkPermissions = async (event: H3Event) => {
  const key = event.path.split('/').pop()

  if (!key) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Malformed url'
    })
  }

  // =============================================================================
  // Fetch media projection
  // =============================================================================

  const eventStore = event.context.eventStore
  const mediaStream = await getMediaByKey(eventStore, key)
  const mediaProjection = mediaStream?.projections?.[MediaProjectionName]

  if (!mediaProjection) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Media not found'
    })
  }

  // =============================================================================
  // Authorize request based on media visibility
  // =============================================================================

  switch (mediaProjection.visibility) {
    case 'public': {
      break
    }
    case 'internal': {
      await requireUserSession(event)
      break
    }
    case 'private': {
      await requireUserSession(event)
      const authUser = await useAuthenticatedUser(event)
      if (authUser.sub !== mediaProjection.ownerId) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden'
        })
      }
      break
    }
  }
}
