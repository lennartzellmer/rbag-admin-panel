import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedQuery, z } from 'h3-zod'
import { getMediaByKey, MediaProjectionName } from '~~/server/domain/media/eventHandling'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'
import { useMinio } from '~~/server/utils/useMinio'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate request query
  // =============================================================================

  const getMediaQuerySchema = z.object({
    key: z.string().min(1)
  })

  const {
    success: isValidQuery,
    data: validatedQuery,
    error: validationError
  } = await useSafeValidatedQuery(event, getMediaQuerySchema)

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      statusText: validationError?.message
    })
  }

  const eventStore = event.context.eventStore

  // =============================================================================
  // Fetch media projection
  // =============================================================================

  const mediaStream = await getMediaByKey(eventStore, validatedQuery.key)
  console.log('mediaStream', mediaStream)
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

  const authUser = await useAuthenticatedUser(event)

  if (mediaProjection.visibility === 'private' && authUser.sub !== mediaProjection.ownerId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  // =============================================================================
  // Generate presigned URL
  // =============================================================================

  const { minioClient } = useMinio()
  const { storage: { s3: { uploadUrlExpirationSeconds: urlExpirationSeconds, bucket } } } = useRuntimeConfig()

  const objectKey = mediaProjection.key.startsWith('/')
    ? mediaProjection.key.slice(1)
    : mediaProjection.key

  try {
    const presignedUrl = await minioClient.presignedGetObject(bucket, objectKey, urlExpirationSeconds)

    return {
      url: presignedUrl
    }
  }
  catch (error) {
    console.error('Failed to generate presigned URL:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate media URL'
    })
  }
})
