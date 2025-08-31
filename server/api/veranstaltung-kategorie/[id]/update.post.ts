import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { updateRbagVeranstaltungKategorie, type UpdateRbagVeranstaltungKategorie } from '~~/server/eventDriven/rbagVeranstaltungsKategorie/businessLogic'
import { evolve, getRbagVeranstaltungsStreamSubjectById, initialState } from '~~/server/eventDriven/rbagVeranstaltungsKategorie'
import { kategorieSchema } from '~~/validation/categorySchema'

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
    kategorieSchema.partial()
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
    const eventStore = event.context.eventStore
    const command: UpdateRbagVeranstaltungKategorie = createCommand({
      type: 'UpdateRbagVeranstaltungKategorie',
      data: {
        ...validatedBody,
        streamSubject: getRbagVeranstaltungsStreamSubjectById(validatedParams.id)
      },
      metadata: { requestedBy: user.email, now: new Date() }
    })

    const result = await handleCommand({
      eventStore,
      evolve,
      initialState,
      streamSubject: getRbagVeranstaltungsStreamSubjectById(validatedParams.id),
      commandHandlerFunction: updateRbagVeranstaltungKategorie,
      command: command
    })

    return {
      ...result
    }
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Error updating event'
    })
  }
})
