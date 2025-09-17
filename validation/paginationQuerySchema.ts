import { z } from 'zod'

export const paginationQuerySchema = z.object({
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0')
})

// =============================================================================
// Types
// =============================================================================

export type PaginationResponseSchema<TData = unknown> = {
  data: TData[]
  meta: {
    total: number
    offset: number
    limit: number
  }
}
