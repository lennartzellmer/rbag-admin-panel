import { z } from 'zod'

export const authUserSchema = z.object({
  sub: z.string(),
  email: z.string().email()
})

export type AuthUser = z.infer<typeof authUserSchema>
