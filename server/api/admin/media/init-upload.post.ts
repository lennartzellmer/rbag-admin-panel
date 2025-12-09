import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { initUploadSchema } from '~~/server/domain/media/validation'
import { useMinio } from '~~/server/utils/useMinio'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const authUser = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const validatedData = await useValidatedBody(event, initUploadSchema)

  // =============================================================================
  // Validate file size and type
  // =============================================================================
  const { filename, contentType, size } = validatedData
  const { minioClient, getExtensionOf } = useMinio()
  const { storage: { s3: { tempBucket: TEMP_BUCKET, uploadUrlExpirationSeconds: UPLOAD_URL_EXPIRATION_SECONDS } } } = useRuntimeConfig()

  if (size > 5 * 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: 'File too large' })
  }

  const extension = getExtensionOf(filename)
  const allowedContentTypes = [
    'image/png', 'image/jpeg', 'image/webp'
  ]
  if (!allowedContentTypes.includes(contentType)) {
    throw createError({ statusCode: 415, statusMessage: `Unsupported content type: ${contentType}. Use one of the following: ${allowedContentTypes.join(', ')}` })
  }

  // =============================================================================
  // Generate presigned upload URL
  // =============================================================================

  const key = `users/${authUser.sub}/uploads/${randomUUID()}${extension ? '.' + extension : ''}`

  const uploadUrl = await minioClient.presignedPutObject(TEMP_BUCKET, key, UPLOAD_URL_EXPIRATION_SECONDS)

  return {
    uploadUrl,
    filename,
    contentType,
    size,
    key
  }
})
