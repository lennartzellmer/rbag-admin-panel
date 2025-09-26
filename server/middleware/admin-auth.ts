export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin/')) {
    const { user } = await requireUserSession(event)
    console.log('Admin auth middleware', user)
  }
})
