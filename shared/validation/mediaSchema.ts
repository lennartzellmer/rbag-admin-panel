import { z } from 'zod'

export const mediaSchema = z.object({
  objectName: z.string().min(1),
  type: z.enum(['image', 'video', 'audio'])
})

export type Media = z.infer<typeof mediaSchema>
