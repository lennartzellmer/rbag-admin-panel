import { validateAuth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) {
    const result = await validateAuth(event)
  }
})
