import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { addRegistrationDetails, type AddRegistrationDetails } from '~~/server/eventDriven/rbagEvents/businessLogic'
import { evolve, getRbagEventStreamNameByKuerzel, initialState } from '~~/server/eventDriven/rbagEvents'
import { RegistrationDetailsSchema } from '~~/validation/eventSchema'

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
    id: z.string()
  })

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Id must be a valid string',
      statusText: validationErrorParams?.message
    })
  }

  const {
    success: isValidBody,
    data: validatedBody,
    error: validationErrorBody
  } = await useSafeValidatedBody(event, RegistrationDetailsSchema)

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationErrorBody?.message
    })
  }

  if (validatedBody.startDate > validatedBody.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Start date must be before end date'
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

  const command: AddRegistrationDetails = {
    type: 'AddRegistrationDetails',
    data: {
      startDate: validatedBody.startDate,
      endDate: validatedBody.endDate,
      lateRegistration: false,
      confirmationText: validatedBody.confirmationText,
      formPDFDownloadLink: validatedBody.formPDFDownloadLink
    },
    metadata: { requestedBy: user.email, now: new Date() }
  }

  try {
    const handle = CommandHandler({ evolve, initialState })
    const { newState } = await handle(eventStore, streamName, state => addRegistrationDetails(command, state))
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
