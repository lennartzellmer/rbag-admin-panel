import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
})

export const createRbagEventCategorySchema = categorySchema.pick({
  name: true,
  description: true
})

export const updateRbagEventCategorySchema = categorySchema.pick({
  name: true,
  description: true
}).partial()

export type CreateRbagEventCategorySchema = z.infer<typeof createRbagEventCategorySchema>
export type UpdateRbagEventCategorySchema = z.infer<typeof updateRbagEventCategorySchema>
export type CategorySchema = z.infer<typeof categorySchema>
