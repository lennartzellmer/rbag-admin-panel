import { defineEventHandler } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { getVeranstaltungKategorieCount, getVeranstaltungsKategorienPaginated } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user object for event metadata
  // =============================================================================

  const { user } = await requireUserSession(event)

  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidQuery,
    data: validatedQuery,
    error: validationErrorQuery
  } = await useSafeValidatedQuery(event, paginationQuerySchema)

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationErrorQuery?.message
    })
  }

  const { offset, limit } = validatedQuery

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const [VeranstaltungsKategorien, total] = await Promise.all([
      getVeranstaltungsKategorienPaginated(eventStore, offset, limit),
      getVeranstaltungKategorieCount(eventStore)
    ])

    return {
      data: VeranstaltungsKategorien,
      meta: {
        total,
        offset,
        limit
      }
    }
  }
  catch (error) {
    console.error('Failed to get events', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get events'
    })
  }
})
