import { randomUUID } from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { createCommand, handleCommand } from 'vorfall'
import { createRbagVeranstaltungSchema } from '~~/validation/veranstaltungSchema'
import { createRbagVeranstaltung, type CreateRbagVeranstaltung } from '~~/server/eventDriven/veranstaltung/businessLogic'
import { evolve, getVeranstaltungStreamSubjectById, initialState } from '~~/server/eventDriven/veranstaltung'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Get user object for event context
  // =============================================================================

  const user = event.context.user!

  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidParams,
    data: validatedData,
    error: validationError
  } = await useSafeValidatedBody(
    event,
    createRbagVeranstaltungSchema
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
      message: 'Error creating veranstaltung'
    })
  }
})
