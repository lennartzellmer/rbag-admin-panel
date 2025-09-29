import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { federatedUserSchema } from '~~/server/domain/user/validation'
import { initUploadSchema } from '~~/server/domain/media/validation'
import { useMinio } from '~~/server/utils/useMinio'

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

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    initUploadSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Validate file size and generate upload URL
  // =============================================================================
  const { filename, contentType, size } = validatedData
  const { minioClient, ensureBucketExists, getExtensionOf } = useMinio()
  const { storage: { s3: { bucket: MEDIA_S3_BUCKET, uploadUrlExpirationSeconds: UPLOAD_URL_EXPIRATION_SECONDS } } } = useRuntimeConfig()

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

  const key = `users/${validatedUserData.sub}/uploads/${randomUUID()}${extension ? '.' + extension : ''}`

  await ensureBucketExists()

  const uploadUrl = await minioClient.presignedPutObject(MEDIA_S3_BUCKET, key, UPLOAD_URL_EXPIRATION_SECONDS)

  return {
    uploadUrl,
    filename,
    contentType,
    size
  }
})
