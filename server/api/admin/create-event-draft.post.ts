import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { eventSchema } from '~~/validation/eventSchema'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = eventSchema.pick({
      name: true,
      abbreviation: true,
      startDate: true,
      endDate: true,
      targetGroupDescription: true,
      categoryId: true
    }).strict().parse(body)

    const eventData = {
      ...validatedData,
      isPublished: false,
      isCanceled: false
    }

    const newEvent = await prisma.event.create({
      data: {
        ...eventData
      }
    })

    return newEvent
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
