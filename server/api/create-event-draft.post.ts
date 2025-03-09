import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { CommandHandler } from '@event-driven-io/emmett'
import { eventDetailsSchema } from '~~/validation/eventSchema'
import { addRbagEventAsDraft, type AddRgabEventAsDraft } from '~~/server/eventDriven/businessLogic'
import { evolve, generateRbagEventStreamName, initialState } from '~~/server/eventDriven/rbagEvent'

export default defineEventHandler(async (event) => {
  try {
    // const user = await requireUserSession(event)
    const body = await readBody(event)
    const validatedData = eventDetailsSchema.pick({
      name: true,
      abbreviation: true,
      startDate: true,
      endDate: true,
      targetGroupDescription: true,
      categoryId: true
    }).strict().parse(body)

    const command: AddRgabEventAsDraft = {
      type: 'AddRbagEventAsDraft',
      data: validatedData,
      metadata: { requestedBy: 'Larry 1', now: new Date() }
    }

    const handle = CommandHandler({ evolve, initialState })
    const eventStore = event.context.eventStore

    const { newState } = await handle(eventStore, generateRbagEventStreamName(), () => addRbagEventAsDraft(command))

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
