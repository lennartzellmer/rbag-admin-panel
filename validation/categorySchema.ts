import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  }).optional(),
  name: z.string().min(1),
  description: z.string().min(1)
})
