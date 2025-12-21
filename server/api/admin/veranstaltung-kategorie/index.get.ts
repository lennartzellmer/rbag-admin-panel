import { defineEventHandler } from 'h3'
import { getVeranstaltungKategorieCount, getVeranstaltungsKategorienPaginated } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { useValidatedQuery } from '~~/server/utils/useValidated'
import { paginationQuerySchema } from '~~/shared/validation/paginationQuerySchema'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const { offset, limit } = await useValidatedQuery(event, paginationQuerySchema)

  // =============================================================================
  // Get events
  // =============================================================================

  try {
    const eventStore = event.context.eventStore

    const [veranstaltungsKategorien, total] = await Promise.all([
      getVeranstaltungsKategorienPaginated(eventStore, offset, limit),
      getVeranstaltungKategorieCount(eventStore)
    ])

    return {
      data: veranstaltungsKategorien,
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
