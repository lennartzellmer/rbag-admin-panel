import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { setCategory, type SetCategory } from '~~/server/eventDriven/rbagEvents/businessLogic'
import { evolve, getRbagEventStreamNameByKuerzel, initialState } from '~~/server/eventDriven/rbagEvents'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Get user object fot event metadata
  /////////////////////////////////////////

  // const { user } = await requireUserSession(event)
  const user = { email: 'test@test.de', name: 'Larry' }

  /////////////////////////////////////////
  /// /////// Parse and validate request body and params
  /////////////////////////////////////////

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationErrorParams
  } = await useSafeValidatedParams(event, {
    id: z.string()
  })

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationErrorParams?.message
    })
  }

  const {
    success: isValidBody,
    data: validatedBody,
    error: validationErrorBody
  } = await useSafeValidatedBody(event, {
    categoryId: z.string().uuid()
  })

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationErrorBody?.message
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

  const command: SetCategory = {
    type: 'SetCategory',
    data: {
      categoryId: validatedBody.categoryId
    },
    metadata: { requestedBy: user.email, now: new Date() }
  }

  try {
    const handle = CommandHandler({ evolve, initialState })
    const { newState } = await handle(eventStore, streamName, () => setCategory(command))
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
