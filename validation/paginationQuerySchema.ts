import { z } from 'zod'

export const paginationQuerySchema = z.object({
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0')
})

export const paginationResponseSchema = z.object({
  data: z.array(z.any()),
  meta: z.object({
    total: z.number().min(0),
    offset: z.number().min(0),
    limit: z.number().min(1)
  })
})

export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>
export type PaginationResponseSchema = z.infer<typeof paginationResponseSchema>
