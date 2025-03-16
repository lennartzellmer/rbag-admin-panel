import { defineEventHandler } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { getRbagEventsPaginated, rbagEventProjectionName, rbagEventStreamType } from '~~/server/eventDriven/rbagEvents'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate request params
  /////////////////////////////////////////

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await useSafeValidatedQuery(event, paginationQuerySchema)

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  const { offset, limit } = validatedParams

  /////////////////////////////////////////
  /// /////// Get events
  /////////////////////////////////////////

  try {
    const eventStore = event.context.eventStore

    const [events, total] = await Promise.all([
      getRbagEventsPaginated(eventStore, offset, limit),
      eventStore.projections.inline.count({
        streamType: rbagEventStreamType,
        projectionName: rbagEventProjectionName
      })
    ])

    const eventsWithoutMetadata = events.map((event) => {
      return {
        id: event._metadata.streamId,
        ...excludeKey(event, '_metadata')
      }
    })

    return {
      data: eventsWithoutMetadata,
      meta: {
        total,
        limit,
        offset
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excludeKey = <T extends object, U extends keyof any>(obj: T, key: U) => {
  const { [key]: _, ...newObj } = obj
  return newObj
}
