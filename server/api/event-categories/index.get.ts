import { defineEventHandler } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { getRbagEventCategoriesPaginated, rbagEventCategoryProjectionName, rbagEventCategoryStreamType } from '~~/server/eventDriven/rbagEventCategories'
import { excludeKey } from '~~/server/utils/excludeKey'
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

    const [events, total] = await Promise.all([
      getRbagEventCategoriesPaginated(eventStore, offset, limit),
      eventStore.projections.inline.count({
        streamType: rbagEventCategoryStreamType,
        projectionName: rbagEventCategoryProjectionName
      })
    ])

    const eventCategoriesWithoutMetadata = events.map((event) => {
      return {
        id: event._metadata.streamId,
        name: event._metadata.streamPosition.toString(),
        ...excludeKey(event, '_metadata')
      }
    })

    return {
      data: eventCategoriesWithoutMetadata,
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
