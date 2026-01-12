import { z } from 'zod'

export const paginationQuerySchema = z.strictObject({
  limit: z.coerce.number('Limit must be a number').positive('Limit must be positive').int('Limit must be an integer'),
  offset: z.coerce.number('Offset must be a number').nonnegative('Offset must be non-negative').int('Offset must be an integer').default(0)
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
