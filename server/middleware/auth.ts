export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) {
    const { user } = await requireUserSession(event)

    if (!user) {
      throw createError({
        status: 401,
        statusMessage: 'Access denied',
        message: 'Please log in'
      })
    }
  }
})
