import { z } from 'zod'

export const paginationQuerySchema = z.object({
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0')
})
