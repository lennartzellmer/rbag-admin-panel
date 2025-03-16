import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody } from 'h3-zod'
import { fromStreamName } from '@event-driven-io/emmett-mongodb'
import { createRbagEventCategory, type CreateRbagEventCategory } from '~~/server/eventDriven/rbagEventCategories/businessLogic'
import { evolve, generateRbagEventCategoryStreamName, initialState } from '~~/server/eventDriven/rbagEventCategories'
import { createRbagEventCategorySchema } from '~~/validation/categorySchema'

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
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    createRbagEventCategorySchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  try {
    const command: CreateRbagEventCategory = {
      type: 'CreateRbagEventCategory',
      data: validatedData,
      metadata: { requestedBy: user.email, now: new Date() }
    }

    const handle = CommandHandler({ evolve, initialState })
    const eventStore = event.context.eventStore
    const streamname = generateRbagEventCategoryStreamName()

    const { newState } = await handle(eventStore, streamname, () => createRbagEventCategory(command))

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
