import { z } from 'zod'
import { defineEventHandler, getQuery, createError } from 'h3'
import { paginationQuerySchema } from '~~/validation/paginationQuerySchema'
import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Validate and parse query parameters
    const query = await getQuery(event)
    const { limit, offset } = paginationQuerySchema.parse(query)

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip: offset,
        take: limit
      }),
      prisma.event.count()
    ])

    console.log('events', events)

    return {
      data: events,
      meta: {
        total,
        limit,
        offset
      }
    }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid query parameters'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Error fetching events'
    })
  }
})
