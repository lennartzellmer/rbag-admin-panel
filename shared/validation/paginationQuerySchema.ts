import { z } from 'zod'

export const paginationQuerySchema = z.strictObject({
  limit: z.coerce.number().int().default(10),
  offset: z.coerce.number().int().default(0)
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
