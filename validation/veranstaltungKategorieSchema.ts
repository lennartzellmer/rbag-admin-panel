import { z } from 'zod'

export const kategorieSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
})

export const createRbagVeranstaltungKategorieSchema = kategorieSchema.pick({
  name: true,
  description: true
})

export const updateRbagVeranstaltungKategorieSchema = kategorieSchema.pick({
  name: true,
  description: true
}).partial().extend({
  streamSubject: z.string()
})

export type CreateRbagVeranstaltungKategorieSchema = z.infer<typeof createRbagVeranstaltungKategorieSchema>
export type UpdateRbagVeranstaltungKategorieSchema = z.infer<typeof updateRbagVeranstaltungKategorieSchema>
export type KategorieSchema = z.infer<typeof kategorieSchema>
