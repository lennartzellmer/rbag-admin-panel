import { z } from 'zod'

// =============================================================================
// Schemas
// =============================================================================

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email().min(5).max(255),
  role: z.enum(['admin', 'user']).default('user'),
  active: z.boolean().default(true)
})

export const CreateUserSchema = UserSchema.omit({ id: true })

// =============================================================================
// Types
// =============================================================================

export type User = z.infer<typeof UserSchema>
export type CreateUserSchema = z.infer<typeof UserSchema>
