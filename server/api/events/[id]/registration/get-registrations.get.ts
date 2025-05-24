import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedParams, useSafeValidatedQuery } from 'h3-zod'
import { getRbagEventRegistrationCountByEventId, getRbagEventRegistrationsByEventIdPaginated } from '~~/server/eventDriven/rbagEventRegistration'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'
import { excludeKey } from '~~/server/utils/excludeKey'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Parse and validate params and query
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
  /// /////// Get registrations for event id
  /////////////////////////////////////////

  const eventStore = event.context.eventStore

  const [registrations, total] = await Promise.all([
    getRbagEventRegistrationsByEventIdPaginated(eventStore, validatedParams.id, offset, limit),
    getRbagEventRegistrationCountByEventId(eventStore, validatedParams.id)
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
