import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { createVeranstaltungsKategorie, type ErstelleVeranstaltungKategorie } from '~~/server/eventDriven/veranstaltungsKategorie/businessLogic'
import { evolve, getVeranstaltungsKategorieStreamSubjectById, initialState } from '~~/server/eventDriven/veranstaltungsKategorie'
import { erstelleVeranstaltungKategorieSchema } from '~~/server/eventDriven/veranstaltungsKategorie/validation'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user object for event metadata
  // =============================================================================

  // TODO: Replace with real user from session
  const user = event.context.user || { email: 'test@test.de', name: 'Testname' }

  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    erstelleVeranstaltungKategorieSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Handle command
  // =============================================================================

  try {
    const eventStore = event.context.eventStore
    const command: ErstelleVeranstaltungKategorie = createCommand({
      type: 'CreateVeranstaltungsKategorie',
      data: validatedData,
      metadata: { requestedBy: user.email, now: new Date() }
    })

    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getVeranstaltungsKategorieStreamSubjectById(randomUUID())
      }],
      commandHandlerFunction: createVeranstaltungsKategorie,
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
