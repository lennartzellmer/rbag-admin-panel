// server/api/users.get.ts
import { z } from 'zod'
import { defineEventHandler, getQuery } from 'h3'
import { Organisation } from '~~/server/models/Organisation'

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

  // Validate and parse query parameters
  const query = await getQuery(event)
  const { limit, offset } = querySchema.parse(query)

  // Perform a paginated query
  const [organisations, total] = await Promise.all([
    Organisation.find({})
      .skip(offset)
      .limit(limit)
      .exec(),
    Organisation.countDocuments()
  ])

  return {
    meta: {
      total,
      limit: limit,
      offset: offset
    },
    data: organisations
  }
})
