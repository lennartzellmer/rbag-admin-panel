import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useValidatedParams, useValidatedBody } from 'h3-zod'
import { eventSchema } from '~~/validation/eventSchema'
import prisma from '~~/lib/prisma'

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
    const { id } = await useValidatedParams(event, {
      id: z.string()
    })

    const body = await useValidatedBody(event, eventSchema.partial())

    const updatedEvent = await prisma.event.update({
      where: {
        id: id
      },
      data: body
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
