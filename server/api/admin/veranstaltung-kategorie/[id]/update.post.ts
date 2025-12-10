import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { updateRbagVeranstaltungKategorie, type AktualisiereVeranstaltungKategorie } from '~~/server/domain/veranstaltungsKategorie/commandHandling'
import { evolve, getVeranstaltungsKategorieStreamSubjectById, initialState } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { veranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import { useAuthenticatedUser } from '~~/server/utils/useAuthenticatedUser'
import { useValidatedBody, useValidatedParams } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user details
  // =============================================================================

  const user = await useAuthenticatedUser(event)

  // =============================================================================
  // Parse and validate
  // =============================================================================

  const query = await useValidatedParams(event, z.object({
    id: z.string().min(1)
  }))

  const body = await useValidatedBody(event, veranstaltungsKategorieSchema.partial())

  // =============================================================================
  // Handle command
  // =============================================================================

  try {
    const eventStore = event.context.eventStore
    const command: AktualisiereVeranstaltungKategorie = createCommand({
      type: 'UpdateVeranstaltungsKategorie',
      data: {
        ...body
      },
      metadata: {
        requestedBy: user.email,
        now: new Date(),
        id: query.id
      }
    })

    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getVeranstaltungsKategorieStreamSubjectById(query.id)
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
