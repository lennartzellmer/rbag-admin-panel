import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import mongoose from 'mongoose'
import { EventModel } from '../../models/Event'

const eventSchema = z.object({
  name: z.string().min(1),
  abbreviation: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string().min(1),
  category: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  }) // MongoDB ObjectId as string
})

export default defineEventHandler(async (event) => {
  // const { user } = await requireUserSession(event)

  // if (!user) {
  //   throw createError({
  //     status: 401,
  //     statusMessage: 'Access denied',
  //     message: 'Please log in'
  //   })
  // }

  try {
    const body = await readBody(event)
    const validatedData = eventSchema.parse(body)

    const newEvent = await EventModel.create({
      ...validatedData
    })

    return {
      data: newEvent
    }
  }
  catch (error) {
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
