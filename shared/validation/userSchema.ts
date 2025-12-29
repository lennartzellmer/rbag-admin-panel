import { z } from 'zod'
import { mediaSchema } from './mediaSchema'

// =============================================================================
// Schemas
// =============================================================================
export const UserSchema = z.object({
  id: z.string().min(1),
  givenName: z.string().min(1),
  familyName: z.string().min(1),
  email: z.object({
    email: z.email(),
    isVerified: z.boolean()
  }),
  roles: z.array(z.string()),
  media: z.object({
    profileImage: mediaSchema
  }).optional()
})

// =============================================================================
// Types
// =============================================================================

export type User = z.infer<typeof UserSchema>
