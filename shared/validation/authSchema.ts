import { z } from 'zod'

// =============================================================================
// Zitadel User Schema
// =============================================================================

export const zitadelUserSchema = z.object({
  'email': z.string().email(),
  'email_verified': z.boolean(),
  'family_name': z.string(),
  'given_name': z.string(),
  'locale': z.string().nullable(),
  'name': z.string(),
  'preferred_username': z.string(),
  'sub': z.string(),
  'updated_at': z.number(),
  'urn:zitadel:iam:org:project:339543160659176242:roles': z.object({
    admin: z.record(z.string(), z.string()),
    user: z.record(z.string(), z.string())
  }),
  'urn:zitadel:iam:org:project:roles': z.object({
    admin: z.record(z.string(), z.string()),
    user: z.record(z.string(), z.string())
  })
})

// =============================================================================
// Types
// =============================================================================

export type ZitadelUser = z.infer<typeof zitadelUserSchema>
