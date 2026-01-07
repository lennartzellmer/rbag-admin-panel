import { federatedUserSchema } from '~~/server/domain/user/validation'

export default defineOAuthZitadelEventHandler({
  onError(event, error) {
    console.error('Zitadel OAuth error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Authentication error', statusText: error.message })
  },
  async onSuccess(event, { user }) {
    const { user: sessionUser } = await setUserSession(event, { user })

    const { success: isValidUser, error } = federatedUserSchema.safeParse(sessionUser)

    if (!isValidUser) {
      console.error('Invalid user data', error)
      throw createError({ statusCode: 400, statusMessage: 'Invalid user data', statusText: error?.message })
    }

    return sendRedirect(event, '/')
  }
})
