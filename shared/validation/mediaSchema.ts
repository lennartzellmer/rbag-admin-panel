import { z } from 'zod'

export const mediaSchema = z.object({
  objectName: z.string().min(1),
  type: z.enum(['image', 'video', 'audio'])
})

export const presignedMediaSchema = mediaSchema.extend({
  url: z.string().url()
})

export type Media = z.infer<typeof mediaSchema>
export type PresignedMedia = z.infer<typeof presignedMediaSchema>
