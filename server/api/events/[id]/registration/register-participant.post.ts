import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { RegistrationSchema } from '~~/validation/registrationSchema'
import { createRbagEventRegistration, type CreateRbagEventRegistration } from '~~/server/eventDriven/rbagEventRegistration/businessLogic'
import { evolve, generateRbagEventRegistrationStreamName } from '~~/server/eventDriven/rbagEventRegistration'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Get user object fot event metadata
  /////////////////////////////////////////

  // const user = await requireUserSession(event)
  const user = { email: 'test@test.de', name: 'Larry' }

  /////////////////////////////////////////
  /// /////// Parse and validate request body and params
  /////////////////////////////////////////

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationErrorParams
  } = await useSafeValidatedParams(event, {
    id: z.string().uuid()
  })

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Id must be a valid UUID',
      statusText: validationErrorParams?.message
    })
  }

  const {
    success: isValidBody,
    data: validatedBody,
    error: validationErrorBody
  } = await useSafeValidatedBody(event, RegistrationSchema.omit({ eventId: true }))

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationErrorBody?.message
    })
  }

  /////////////////////////////////////////
  /// /////// Handle command
  /////////////////////////////////////////

  const command: CreateRbagEventRegistration = {
    type: 'CreateRbagEventRegistration',
    data: {
      eventId: validatedParams.id,
      ...validatedBody
    },
    metadata: { requestedBy: user.email, now: new Date() }
  }

  const eventStore = event.context.eventStore
  const streamName = generateRbagEventRegistrationStreamName()

  try {
    const handle = CommandHandler({ evolve, initialState: () => null })
    const { newState } = await handle(eventStore, streamName, () => createRbagEventRegistration(command))
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
