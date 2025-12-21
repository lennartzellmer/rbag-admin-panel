export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/'))
    return

  const { user } = await requireUserSession(event)
  if (!user.roles.includes('user')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
})
