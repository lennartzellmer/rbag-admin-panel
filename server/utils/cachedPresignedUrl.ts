import type { Media } from '~~/shared/validation/mediaSchema'

export const cachedPresignedUrl = defineCachedFunction(async (media: Media) => {
  // =============================================================================
  // Generate presigned URL
  // =============================================================================

  const { minioClient } = useMinio()
  const runtimeConfig = useRuntimeConfig()
  const urlExpirationSeconds = runtimeConfig.storage.s3.uploadUrlExpirationSeconds
  const bucket = runtimeConfig.storage.s3.bucket

  const url = await minioClient.presignedGetObject(bucket, media.objectName, urlExpirationSeconds).catch((error) => {
    console.error('Failed to generate presigned URL:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate media URL'
    })
  })
  return {
    ...media,
    url
  }
}, {
  maxAge: (() => {
    const runtimeConfig = useRuntimeConfig()
    return Math.round(runtimeConfig.storage.s3.uploadUrlExpirationSeconds * 0.5)
  })(),
  name: 'minioPresignedUrl',
  getKey: (media: Media) => media.objectName
})
