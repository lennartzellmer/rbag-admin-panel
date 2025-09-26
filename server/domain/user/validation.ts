import { z } from 'zod'

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
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email().min(5).max(255),
  role: z.enum(['admin', 'user']).default('user'),
  provider: z.enum(['linear']),
  profilePictureUrl: z.string().url().max(2048).optional()
})

export const CreateUserSchema = userSchema.omit({ id: true })

export const attachUserProfilePictureSchema = z.object({
  profilePictureUrl: z.string().url().max(2048)
})

// =============================================================================
// Types
// =============================================================================

export type User = z.infer<typeof userSchema>
export type CreateUserSchema = z.infer<typeof userSchema>
export type AttachUserProfilePictureSchema = z.infer<typeof attachUserProfilePictureSchema>
