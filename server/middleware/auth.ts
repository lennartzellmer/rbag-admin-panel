import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) {
    const { user } = await requireUserSession(event)
    event.context.user = user
  }
})

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    user?: ReturnType<typeof requireUserSession>['user']
  }
}
