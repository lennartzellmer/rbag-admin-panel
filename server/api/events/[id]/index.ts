import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { getRbagEventById } from '~~/server/eventDriven/rbagEvent'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const querySchema = z.object({ eventId: z.string().uuid() }).strict()

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await getValidatedQuery(
    event,
    query => querySchema.safeParse(query)
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  /////////////////////////////////////////
  /// /////// Check if event exists
  /////////////////////////////////////////

  const eventStore = event.context.eventStore

  const rbagEvent = await getRbagEventById(eventStore, validatedParams.eventId)

  if (!rbagEvent) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  return {
    id: rbagEvent._metadata.streamId,
    name: rbagEvent._metadata.streamPosition.toString(),
    ...excludeKey(rbagEvent, '_metadata')
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excludeKey = <T extends object, U extends keyof any>(obj: T, key: U) => {
  const { [key]: _, ...newObj } = obj
  return newObj
}
