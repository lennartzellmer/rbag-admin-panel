import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { createVeranstaltungSchema } from '~~/validation/veranstaltungSchema'
import { createRbagVeranstaltung, type CreateRbagVeranstaltung } from '~~/server/domain/veranstaltung/commandHandling'
import { evolve, getVeranstaltungStreamSubjectById, initialState } from '~~/server/domain/veranstaltung/eventHandling'
import { extractAuthUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user object for event metadata
  // =============================================================================

  const user = extractAuthUser(event)

  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    createVeranstaltungSchema
  )

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Handle command
  // =============================================================================

  try {
    const eventStore = event.context.eventStore
    const command: CreateRbagVeranstaltung = createCommand({
      type: 'CreateRbagVeranstaltung',
      data: validatedData,
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
