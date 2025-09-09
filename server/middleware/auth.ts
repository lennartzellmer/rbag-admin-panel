export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) {
    const { user } = await requireUserSession(event) as unknown as { user: User }
    event.context.user = user
  }
})

interface User {
  email: string
  name: string
}

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    user?: User
  }
}
