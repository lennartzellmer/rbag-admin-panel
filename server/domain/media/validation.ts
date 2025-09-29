import { z } from 'zod'

// =============================================================================
// Schemas
// =============================================================================

export const initUploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().min(1)
})

export const mediaMetadataSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1),
  ownerId: z.string().min(1),
  visibility: z.enum(['private', 'internal', 'public']),
  status: z.enum(['active', 'deleted']),
  size: z.number().min(0).optional()
})

// =============================================================================
// Types
// =============================================================================

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>
