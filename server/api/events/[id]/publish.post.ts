import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedParams } from 'h3-zod'
import { publishRbagEvent, type PublishRbagEvent } from '~~/server/eventDriven/rbagEvents/businessLogic'
import { evolve, getRbagEventStreamNameByKuerzel, initialState } from '~~/server/eventDriven/rbagEvents'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Get user object fot event metadata
  /////////////////////////////////////////

  // const { user } = await requireUserSession(event)
  const user = { email: 'test@test.de', name: 'Larry' }

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
  const streamName = getRbagEventStreamNameByKuerzel(validatedParams.id)
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

  const command: PublishRbagEvent = {
    type: 'PublishRbagEvent',
    data: {},
    metadata: { requestedBy: user.email, now: new Date() }
  }

  try {
    const handle = CommandHandler({ evolve, initialState })
    const { newState } = await handle(eventStore, streamName, state => publishRbagEvent(command, state))
    return newState
  }
  catch (error) {
    console.error(error)
    if (error instanceof IllegalStateError) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Error creating event'
    })
  }
})
