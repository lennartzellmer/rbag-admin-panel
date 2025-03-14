import { defineEventHandler } from 'h3'
import { useSafeValidatedParams, z } from 'h3-zod'
import { getRbagEventCategoryById } from '~~/server/eventDriven/rbagEventCategories'

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
  /// /////// Get category by id
  /////////////////////////////////////////

  const eventStore = event.context.eventStore

  const rbagEventCategory = await getRbagEventCategoryById(eventStore, validatedParams.id)

  if (!rbagEventCategory) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  return {
    id: rbagEventCategory._metadata.streamId,
    name: rbagEventCategory._metadata.streamPosition.toString(),
    ...excludeKey(rbagEventCategory, '_metadata')
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excludeKey = <T extends object, U extends keyof any>(obj: T, key: U) => {
  const { [key]: _, ...newObj } = obj
  return newObj
}
