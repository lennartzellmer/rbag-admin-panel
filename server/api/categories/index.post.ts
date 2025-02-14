import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import type { ICategory } from '../../models/Category'
import prisma from '~~/lib/prisma'

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
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
    const validatedData = categorySchema.parse(body) satisfies ICategory

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
