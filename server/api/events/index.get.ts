import { z } from 'zod'
import { defineEventHandler, getQuery, createError } from 'h3'
import { EventModel, type IEventDocument } from '../../models/Event'

const querySchema = z.object({
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0')
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
    // Validate and parse query parameters
    const query = await getQuery(event)
    const { limit, offset } = querySchema.parse(query)

    const [events, total] = await Promise.all([
      EventModel.find()
        .skip(offset)
        .limit(limit)
        .exec(),
      EventModel.countDocuments()
    ])

    return {
      data: events as IEventDocument[],
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
