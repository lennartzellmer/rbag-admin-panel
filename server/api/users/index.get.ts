// server/api/users.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { User } from '../../models/User'
import type { OrganisationDocument } from '../../models/Organisation'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'Access denied',
      message: 'Please log in'
    })
  }

  // Extract query params for pagination (default: page=1, limit=10)
  const { offset = '0', limit = '10' } = getQuery(event) as {
    offset?: string
    limit?: string
  }

  const offsetNum = parseInt(offset, 10) || 1
  const limitNum = parseInt(limit, 10) || 10

  // Perform a paginated query
  const [users, total] = await Promise.all([
    User.find({})
      .skip(offsetNum)
      .limit(limitNum)
      .populate<OrganisationDocument>('organisation')
      .exec(),
    User.countDocuments()
  ])

  return {
    totalCount: total,
    data: users
  }
})
