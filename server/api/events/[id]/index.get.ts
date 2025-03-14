import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedParams } from 'h3-zod'
import { getRbagEventById } from '~~/server/eventDriven/rbagEvents'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await useSafeValidatedParams(event, {
    id: z.string().uuid()
  })

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

  const rbagEvent = await getRbagEventById(eventStore, validatedParams.id)

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
