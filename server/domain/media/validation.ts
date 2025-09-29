import { z } from 'zod'

// =============================================================================
// Schemas
// =============================================================================

export const mediaMetadataSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1),
  ownerId: z.string().min(1),
  type: z.enum(['profile']),
  visibility: z.enum(['private', 'internal', 'public']),
  version: z.number().min(1),
  status: z.enum(['active', 'deleted']),
  mimeType: z.string().min(1).optional(),
  size: z.number().min(0).optional()
})

export const createMediaSchema = mediaMetadataSchema.omit({ id: true })

// =============================================================================
// Types
// =============================================================================

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>
export type CreateMediaSchema = z.infer<typeof createMediaSchema>
