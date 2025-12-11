import { z } from 'zod'
import { mediaSchema } from '~~/shared/validation/mediaSchema'

// =============================================================================
// Schemas
// =============================================================================

export const federatedUserSchema = z.object({
  sub: z.string(),
  name: z.string().min(2).max(100),
  email: z.string().email().min(5).max(255),
  roles: z.array(z.string())
})

export const userSchema = z.object({
  id: z.uuid(),
  media: z.object({
    profileImage: mediaSchema
  }).optional()
})

export const CreateUserSchema = userSchema.pick({ id: true })

export const attachProfileImageSchema = z.object({
  profileImageObjectName: z.string()
})

export const removeProfileImageSchema = z.object({
  userId: z.string().uuid()
})

// =============================================================================
// Types
// =============================================================================

export type User = z.infer<typeof userSchema>
export type CreateUserSchema = z.infer<typeof CreateUserSchema>
export type AttachProfileImageSchema = z.infer<typeof attachProfileImageSchema>
export type RemoveProfileImageSchema = z.infer<typeof removeProfileImageSchema>
