import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { CommandHandler, IllegalStateError } from '@event-driven-io/emmett'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { fromStreamName } from '@event-driven-io/emmett-mongodb'
import { updateRbagEventCategory, type UpdateRbagEventCategory } from '~~/server/eventDriven/rbagEventCategories/businessLogic'
import { evolve, getRbagEventCategoryStreamNameById, initialState } from '~~/server/eventDriven/rbagEventCategories'
import { updateRbagEventCategorySchema } from '~~/validation/categorySchema'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Get user object fot event metadata
  /////////////////////////////////////////

  // const { user } = await requireUserSession(event)
  const user = { email: 'test@test.de', name: 'Larry' }

  /////////////////////////////////////////
  /// /////// Parse and validate request params and body
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
    success: isValidBody,
    data: validatedBody,
    error: validationErrorBody
  } = await useSafeValidatedBody(
    event,
    updateRbagEventCategorySchema
  )

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

  try {
    const command: UpdateRbagEventCategory = {
      type: 'UpdateRbagEventCategory',
      data: validatedBody,
      metadata: { requestedBy: user.email, now: new Date() }
    }

    const handle = CommandHandler({ evolve, initialState })
    const eventStore = event.context.eventStore
    const streamname = getRbagEventCategoryStreamNameById(validatedParams.id)

    const { newState } = await handle(eventStore, streamname, () => updateRbagEventCategory(command))

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
