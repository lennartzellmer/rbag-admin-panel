import { randomUUID } from 'node:crypto'
import { createError, defineEventHandler } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// =============================================================================
// Types
// =============================================================================

type SessionUser = {
  id: string
  email: string
  name: string
}

type BackblazeConfig = {
  bucket: string
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  expiresInSeconds: number
}

// =============================================================================
// Constants
// =============================================================================

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'] as const

const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif'
}

const profileUploadUrlQuerySchema = z.object({
  contentType: z.enum(ACCEPTED_IMAGE_TYPES),
  fileExtension: z
    .string()
    .optional()
    .transform(extension => extension?.replace(/^\./, '').toLowerCase())
    .refine(
      extension => !extension || /^[a-z0-9]+$/i.test(extension),
      'File extension may only contain letters and numbers'
    )
})

type ProfileUploadUrlQuery = z.infer<typeof profileUploadUrlQuerySchema>

const backblazeConfig = getBackblazeConfig()

const backblazeClient = new S3Client({
  region: backblazeConfig.region,
  endpoint: backblazeConfig.endpoint,
  credentials: {
    accessKeyId: backblazeConfig.accessKeyId,
    secretAccessKey: backblazeConfig.secretAccessKey
  },
  forcePathStyle: true
})

// =============================================================================
// Handler
// =============================================================================

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Validate query parameters
  // =============================================================================

  const {
    success: isValidQuery,
    data: query,
    error: queryError
  } = await useSafeValidatedQuery(event, profileUploadUrlQuerySchema)

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      statusText: queryError?.message
    })
  }

  const user = event.context

  console.log('User requesting profile upload URL:', user)

  const fileExtension = resolveFileExtension(query)
  const objectKey = buildObjectKey(user.id, fileExtension)

  // =============================================================================
  // Generate presigned URL
  // =============================================================================

  try {
    console.log(`Generated Backblaze presigned URL for user`)
    const putObject = new PutObjectCommand({
      Bucket: backblazeConfig.bucket,
      Key: objectKey,
      ContentType: query.contentType
    })

    const uploadUrl = await getSignedUrl(backblazeClient, putObject, {
      expiresIn: backblazeConfig.expiresInSeconds
    })

    return {
      uploadUrl,
      headers: {
        'Content-Type': query.contentType
      },
      expiresIn: backblazeConfig.expiresInSeconds,
      objectKey
    }
  }
  catch (error) {
    console.error('Failed to create Backblaze presigned URL', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create profile upload URL'
    })
  }
})

// =============================================================================
// Helpers
// =============================================================================

function getBackblazeConfig(): BackblazeConfig {
  const bucket = process.env.NUXT_BACKBLAZE_S3_BUCKET
  const endpoint = process.env.NUXT_BACKBLAZE_S3_ENDPOINT
  const region = process.env.NUXT_BACKBLAZE_S3_REGION
  const accessKeyId = process.env.NUXT_BACKBLAZE_S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.NUXT_BACKBLAZE_S3_SECRET_ACCESS_KEY
  const expiresInSeconds = parseInt(process.env.NUXT_BACKBLAZE_S3_PRESIGN_EXPIRES_IN ?? '300', 10)

  if (!bucket) {
    throw new Error('Missing required environment variable NUXT_BACKBLAZE_S3_BUCKET')
  }

  if (!endpoint) {
    throw new Error('Missing required environment variable NUXT_BACKBLAZE_S3_ENDPOINT')
  }

  if (!region) {
    throw new Error('Missing required environment variable NUXT_BACKBLAZE_S3_REGION')
  }

  if (!accessKeyId) {
    throw new Error('Missing required environment variable NUXT_BACKBLAZE_S3_ACCESS_KEY_ID')
  }

  if (!secretAccessKey) {
    throw new Error('Missing required environment variable NUXT_BACKBLAZE_S3_SECRET_ACCESS_KEY')
  }

  if (Number.isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
    throw new Error('Invalid NUXT_BACKBLAZE_S3_PRESIGN_EXPIRES_IN value. Must be a positive integer.')
  }

  return {
    bucket,
    endpoint: endpoint.replace(/\/$/, ''),
    region,
    accessKeyId,
    secretAccessKey,
    expiresInSeconds
  }
}

function resolveFileExtension(query: ProfileUploadUrlQuery): string {
  if (query.fileExtension) {
    return query.fileExtension
  }

  const inferredExtension = CONTENT_TYPE_EXTENSIONS[query.contentType]

  if (!inferredExtension) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported content type',
      statusText: `Unable to determine file extension for ${query.contentType}`
    })
  }

  return inferredExtension
}

function buildObjectKey(userId: string, fileExtension: string): string {
  return `users/${userId}/profile/${randomUUID()}.${fileExtension}`
}
