import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~~/lib/prisma'
import { categorySchema } from '~~/validation/categorySchema'

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
    const validatedData = categorySchema.parse(body)

    const newCategory = await prisma.category.create({
      data: {
        ...validatedData
      }
    })

    return {
      data: newCategory
    }
  }
  catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      console.error(error)
      throw createError({
        statusCode: 400,
        message: 'Invalid category data'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Error creating category'
    })
  }
})
