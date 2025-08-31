import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { createRbagVeranstaltungKategorieSchema } from '~~/validation/categorySchema'
import { createRbagVeranstaltungKategorie, type CreateRbagVeranstaltungKategorie } from '~~/server/eventDriven/rbagVeranstaltungsKategorie/businessLogic'
import { evolve, getRbagVeranstaltungsStreamSubjectById, initialState } from '~~/server/eventDriven/rbagVeranstaltungsKategorie'

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
    createRbagVeranstaltungKategorieSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  /////////////////////////////////////////
  /// /////// Handle command
  /////////////////////////////////////////

  try {
    const eventStore = event.context.eventStore
    const command: CreateRbagVeranstaltungKategorie = createCommand({
      type: 'CreateRbagVeranstaltungKategorie',
      data: validatedData,
      metadata: { requestedBy: user.email, now: new Date() }
    })

    const result = await handleCommand({
      eventStore,
      evolve,
      initialState,
      streamSubject: getRbagVeranstaltungsStreamSubjectById(randomUUID()),
      commandHandlerFunction: createRbagVeranstaltungKategorie,
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
      message: 'Error creating event'
    })
  }
})
