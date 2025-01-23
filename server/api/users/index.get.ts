// server/api/users.get.ts
import { defineEventHandler, getQuery } from 'h3'

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
  const { page = '1', limit = '10' } = getQuery(event) as {
    page?: string
    limit?: string
  }

  const pageNum = parseInt(page, 10) || 1
  const limitNum = parseInt(limit, 10) || 10
  const skipCount = (pageNum - 1) * limitNum

  // Perform a paginated query
  const [users, total] = await Promise.all([
    User.find({})
      .skip(skipCount)
      .limit(limitNum)
      .exec(),
    User.countDocuments()
  ])

  return {
    page: pageNum,
    limit: limitNum,
    total,
    data: users
  }
})
