import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { CommandHandler } from '@event-driven-io/emmett'
import { registrationSchema } from '~~/validation/eventSchema'
import { addRegistrationDetails, type AddRegistrationDetails } from '~~/server/eventDriven/businessLogic'
import { evolve, getStreamNameById, initialState } from '~~/server/eventDriven/rbagEvent'

export default defineEventHandler(async (event) => {
  try {
    // const user = await requireUserSession(event)
    const body = await readBody(event)
    const validatedData = registrationSchema
      .pick({
        startDate: true,
        endDate: true
      })
      .extend({
        eventId: z.string().uuid()
      })
      .strict()
      .parse(body)

    const command: AddRegistrationDetails = {
      type: 'AddRegistrationDetails',
      data: {
        ...validatedData,
        lateRegistration: false
      },
      metadata: { requestedBy: 'Larry 1', now: new Date() }
    }

    const handle = CommandHandler({ evolve, initialState })
    const eventStore = event.context.eventStore

    const { newState } = await handle(eventStore, getStreamNameById(validatedData.eventId), state => addRegistrationDetails(command, state))

    return newState
  }
  catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid event data'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Error creating event'
    })
  }
})
