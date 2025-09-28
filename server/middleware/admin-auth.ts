export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin/')) {
    const { user } = await requireUserSession(event)
    if (!user.roles.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden'
      })
    }
  }
})
