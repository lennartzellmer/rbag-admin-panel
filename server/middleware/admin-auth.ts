export default defineEventHandler(async (event) => {
  console.log('Admin auth middleware', event.path)
  if (event.path.startsWith('/api/admin/')) {
    await requireUserSession(event)
  }
})
