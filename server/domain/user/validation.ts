import { z } from 'zod'

// =============================================================================
// Schemas
// =============================================================================

export const federatedUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email().min(5).max(255)
})

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email().min(5).max(255),
  role: z.enum(['admin', 'user']).default('user'),
  provider: z.enum(['linear'])
})

export const CreateUserSchema = userSchema.omit({ id: true })

// =============================================================================
// Types
// =============================================================================

export type User = z.infer<typeof userSchema>
export type CreateUserSchema = z.infer<typeof userSchema>
