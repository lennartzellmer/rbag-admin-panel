import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { CommandHandler } from '@event-driven-io/emmett'
import { registrationSchema } from '~~/validation/eventSchema'
import { addRegistrationDetails, type AddRegistrationDetails } from '~~/server/eventDriven/businessLogic'
import { evolve, getStreamNameById, initialState } from '~~/server/eventDriven/rbagEvent'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Autehntication
  /////////////////////////////////////////

  // const user = await requireUserSession(event)

  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const body = await readBody(event)
  const { success: isValidParams, data: validatedData, error: validationError } = registrationSchema
    .pick({
      startDate: true,
      endDate: true
    })
    .extend({
      eventId: z.string().uuid()
    })
    .strict()
    .safeParse(body)

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

  const command: AddRegistrationDetails = {
    type: 'AddRegistrationDetails',
    data: {
      ...validatedData,
      lateRegistration: false
    },
    metadata: { requestedBy: 'Larry 1', now: new Date() }
  }

  try {
    const handle = CommandHandler({ evolve, initialState })

    const { newState } = await handle(eventStore, streamName, state => addRegistrationDetails(command, state))

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
