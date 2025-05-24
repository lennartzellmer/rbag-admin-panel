import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedParams } from 'h3-zod'
import { getRbagEventByKuerzel } from '~~/server/eventDriven/rbagEvents'
import { excludeKey } from '~~/server/utils/excludeKey'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await useSafeValidatedParams(event, {
    id: z.string()
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

  const rbagEvent = await getRbagEventByKuerzel(eventStore, validatedParams.id)

  if (!rbagEvent) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  return {
    id: rbagEvent._metadata.streamId,
    ...excludeKey(rbagEvent, '_metadata')
  }
})
