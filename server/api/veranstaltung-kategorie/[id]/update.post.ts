import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { updateRbagVeranstaltungKategorie, type AktualisiereVeranstaltungKategorie } from '~~/server/domain/veranstaltungsKategorie/commandHandling'
import { evolve, getVeranstaltungsKategorieStreamSubjectById, initialState } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { veranstaltungsKategorieSchema } from '~~/validation/veranstaltungKategorieSchema'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user object for event metadata
  // =============================================================================

  // TODO: Replace with real user from session
  const user = event.context.user || { email: 'test@test.de', name: 'Testname' }

  // =============================================================================
  // Parse and validate request params and body
  // =============================================================================

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
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  const {
    success: isValidBody,
    data: validatedBody,
    error: validationErrorBody
  } = await useSafeValidatedBody(
    event,
    veranstaltungsKategorieSchema.partial()
  )

  if (!isValidBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationErrorBody?.message
    })
  }

  // =============================================================================
  // Handle command
  // =============================================================================

  try {
    const eventStore = event.context.eventStore
    const command: AktualisiereVeranstaltungKategorie = createCommand({
      type: 'UpdateVeranstaltungsKategorie',
      data: {
        ...validatedBody
      },
      metadata: {
        requestedBy: user.email,
        now: new Date(),
        id: validatedParams.id
      }
    })

    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getVeranstaltungsKategorieStreamSubjectById(validatedParams.id)
      }],
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
      statusMessage: 'Error updating event'
    })
  }
})
