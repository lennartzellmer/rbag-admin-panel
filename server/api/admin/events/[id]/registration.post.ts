import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import { useValidatedParams } from 'h3-zod'
import { registrationSchema } from '~~/validation/eventSchema'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useValidatedParams(event, {
      id: z.string()
    })

    const body = await readBody(event)
    const validatedData = registrationSchema.strict().parse(body)

    const updatedEvent = await prisma.event.update({
      where: {
        id: id
      },
      data: {
        registration: validatedData
      }
    })

    return {
      data: {
        registration: updatedEvent
      }
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
