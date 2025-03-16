import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedParams, useSafeValidatedQuery } from 'h3-zod'
import { getRbagEventRegistrationsByEventIdPaginated, rbagEventRegistrationProjectionName, rbagEventRegistrationStreamType } from '~~/server/eventDriven/rbagEventRegistration'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'

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
  /// /////// Check if event exists
  /////////////////////////////////////////

  const eventStore = event.context.eventStore

  const [registrations, total] = await Promise.all([
    getRbagEventRegistrationsByEventIdPaginated(eventStore, validatedParams.id, offset, limit),
    eventStore.projections.inline.count({
      streamType: rbagEventRegistrationStreamType,
      projectionName: rbagEventRegistrationProjectionName
    },
    { eventId: validatedParams.id }
    )
  ])

  const registrationsWithoutMetadata = registrations.map((registration) => {
    return {
      id: registration._metadata.streamId,
      name: registration._metadata.streamPosition.toString(),
      ...excludeKey(registration, '_metadata')
    }
  })

  return {
    data: registrationsWithoutMetadata,
    meta: {
      total,
      limit,
      offset
    }
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excludeKey = <T extends object, U extends keyof any>(obj: T, key: U) => {
  const { [key]: _, ...newObj } = obj
  return newObj
}
