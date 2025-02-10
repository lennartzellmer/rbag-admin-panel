import { z } from 'zod'
import { defineEventHandler, getQuery, createError } from 'h3'
import { EventModel } from '../../models/Event'

const querySchema = z.object({
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0')
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'Access denied',
      message: 'Please log in'
    })
  }

  try {
    // Validate and parse query parameters
    const query = await getQuery(event)
    const { limit, offset } = querySchema.parse(query)

    // Get total count and fetch events with pagination in parallel
    const [total, events] = await Promise.all([
      EventModel.countDocuments(),
      EventModel.find()
        .skip(offset)
        .limit(limit)
        .lean()
        .exec()
    ])

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
