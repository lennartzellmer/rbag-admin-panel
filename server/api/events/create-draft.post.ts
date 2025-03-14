import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody } from 'h3-zod'
import { fromStreamName } from '@event-driven-io/emmett-mongodb'
import { addRbagEventAsDraft, type AddRgabEventAsDraft } from '~~/server/eventDriven/rbagEvents/businessLogic'
import { evolve, generateRbagEventStreamName, initialState } from '~~/server/eventDriven/rbagEvents'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Get user object fot event metadata
  /////////////////////////////////////////

  // const { user } = await requireUserSession(event)
  const user = { email: 'test@test.de', name: 'Larry' }

  /////////////////////////////////////////
  /// /////// Parse and validate request body
  /////////////////////////////////////////

  const bodySchema = z.object({
    name: z.string().min(1),
    abbreviation: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    targetGroupDescription: z.string().min(1),
    categoryId: z.string().uuid()
  }).strict()

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    bodySchema
  )

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
  /// /////// Handle command
  /////////////////////////////////////////

  try {
    const command: AddRgabEventAsDraft = {
      type: 'AddRbagEventAsDraft',
      data: validatedData,
      metadata: { requestedBy: user.email, now: new Date() }
    }

    const handle = CommandHandler({ evolve, initialState })
    const eventStore = event.context.eventStore
    const streamname = generateRbagEventStreamName()

    const { newState } = await handle(eventStore, streamname, () => addRbagEventAsDraft(command))

    return {
      id: fromStreamName(streamname).streamId,
      ...newState
    }
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
