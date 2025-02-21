import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useValidatedParams, useValidatedBody } from 'h3-zod'
import prisma from '~~/lib/prisma'
import { eventSchema } from '~~/validation/eventSchema'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useValidatedParams(event, {
      id: z.string()
    })

    const body = await readBody(event)
    const validatedData = await useValidatedBody(body, eventSchema.omit({ id: true }).partial())

    const updatedEvent = await prisma.event.update({
      where: {
        id: id
      },
      data: validatedData,
      include: {
        category: true
      }
    })

    if (!updatedEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    return updatedEvent
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
      message: 'Error updating event'
    })
  }
})
