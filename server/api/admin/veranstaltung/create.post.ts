import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { createVeranstaltungSchema } from '~~/shared/validation/veranstaltungSchema'
import { createRbagVeranstaltung, type CreateRbagVeranstaltung } from '~~/server/domain/veranstaltung/commandHandling'
import { evolve, getVeranstaltungStreamSubjectById, initialState } from '~~/server/domain/veranstaltung/eventHandling'
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

  const body = await useValidatedBody(
    event,
    createVeranstaltungSchema
  )

  // =============================================================================
  // Handle command
  // =============================================================================

  try {
    const eventStore = event.context.eventStore
    const command: CreateRbagVeranstaltung = createCommand({
      type: 'CreateRbagVeranstaltung',
      data: body,
      metadata: { requestedBy: user.email, now: new Date() }
    })

    const result = await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getVeranstaltungStreamSubjectById(randomUUID())
      }
      ],
      commandHandlerFunction: createRbagVeranstaltung,
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
      statusMessage: 'Error creating veranstaltung'
    })
  }
})
