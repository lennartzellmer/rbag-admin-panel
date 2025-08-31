import { defineEventHandler } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { getRbagVeranstaltungKategorieCount, getRbagVeranstaltungsKategorienPaginated } from '~~/server/eventDriven/rbagVeranstaltungsKategorie'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const {
    success: isValidQuery,
    data: validatedQuery,
    error: validationErrorQuery
  } = await useSafeValidatedQuery(event, paginationQuerySchema)

  if (!isValidQuery) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationErrorQuery?.message
    })
  }

  const { offset, limit } = validatedQuery

  /////////////////////////////////////////
  /// /////// Get events
  /////////////////////////////////////////

  try {
    const eventStore = event.context.eventStore

    const [VeranstaltungsKategorien, total] = await Promise.all([
      getRbagVeranstaltungsKategorienPaginated(eventStore, offset, limit),
      getRbagVeranstaltungKategorieCount(eventStore)
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
    createError({
      statusCode: 500,
      message: 'Failed to get events'
    })
  }
})
