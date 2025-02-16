import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useValidatedParams, useValidatedBody } from 'h3-zod'
import { categorySchema } from '~~/validation/categorySchema'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useValidatedParams(event, {
      id: z.string()
    })

    const body = await useValidatedBody(event, categorySchema.partial())

    const updatedCategory = await prisma.category.update({
      where: {
        id: id
      },
      data: body
    })

    if (!updatedCategory) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    return updatedCategory
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
