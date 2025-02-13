import { z } from 'zod'
import mongoose from 'mongoose'
import { useValidatedParams } from 'h3-zod'
import { defineEventHandler, createError } from 'h3'
import { EventModel } from '../../models/Event'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useValidatedParams(event, {
      id: z.string().refine(val => mongoose.Types.ObjectId.isValid(val))
    })

    const foundEvent = await EventModel.findById(id)

    if (!foundEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    return foundEvent
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid event ID'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Error fetching event'
    })
  }
})
