import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { erstelleVeranstaltungsKategorie, type ErstelleVeranstaltungKategorie } from '~~/server/domain/veranstaltungsKategorie/commandHandling'
import { evolve, getVeranstaltungsKategorieStreamSubjectById, initialState } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { erstelleVeranstaltungKategorieSchema } from '~~/server/domain/veranstaltungsKategorie/validation'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const user = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate
  // =============================================================================

  const validatedData = await useValidatedBody(
    event,
    erstelleVeranstaltungKategorieSchema
  )

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
      commandHandlerFunction: erstelleVeranstaltungsKategorie,
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
      statusMessage: 'Error creating event'
    })
  }
})
