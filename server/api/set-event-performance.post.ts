import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { CommandHandler } from '@event-driven-io/emmett'
import { setPerformanceDetails, type SetPerformanceDetails } from '~~/server/eventDriven/businessLogic'
import { evolve, getStreamNameById, initialState } from '~~/server/eventDriven/rbagEvent'
import { locationSchema } from '~~/validation/eventSchema'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Autehntication
  /////////////////////////////////////////

  // const user = await requireUserSession(event)

  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const body = await readBody(event)
  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = z.object({
    eventId: z.string().uuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    description: z.string().min(1),
    location: locationSchema,
    posterDownloadUrl: z.string().min(1)
  }).strict().safeParse(body)

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  if (validatedData.startDate > validatedData.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Start date must be before end date'
    })
  }

  /////////////////////////////////////////
  /// /////// Check if event exists
  /////////////////////////////////////////

  const eventStore = event.context.eventStore
  const streamName = getStreamNameById(validatedData.eventId)
  const eventStream = await eventStore.readStream(streamName)

  if (!eventStream.streamExists) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  /////////////////////////////////////////
  /// /////// Handle command
  /////////////////////////////////////////

  const command: SetPerformanceDetails = {
    type: 'SetPerformanceDetails',
    data: {
      description: validatedData.description,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      location: validatedData.location,
      posterDownloadUrl: validatedData.posterDownloadUrl
    },
    metadata: { requestedBy: 'Larry 1', now: new Date() }
  }

  try {
    const handle = CommandHandler({ evolve, initialState })
    const { newState } = await handle(eventStore, streamName, () => setPerformanceDetails(command))
    return newState
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Error creating event'
    })
  }
})
