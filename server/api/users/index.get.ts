// server/api/users.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { User } from '../../models/User'
import type { OrganisationDocument } from '../../models/Organisation'

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

    // Perform a paginated query
    const [users, total] = await Promise.all([
      User.find({})
        .skip(offset)
        .limit(limit)
        .populate<OrganisationDocument>('organisation')
        .exec(),
      User.countDocuments()
    ])

    return {
      meta: {
        total,
        limit,
        offset
      },
      data: users
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
