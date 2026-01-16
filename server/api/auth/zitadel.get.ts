import { federatedUserSchema } from '~~/server/domain/user/validation'

export default defineOAuthZitadelEventHandler({
  onError(event, error) {
    console.error('Zitadel OAuth error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Authentication error', statusText: error.message })
  },
  async onSuccess(event, { user, tokens }) {
    // Decode the ID token to extract the session ID
    const [_, payload] = tokens.id_token.split('.')
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString())

    // Persist user and sessionId in session
    const secure = { sessionId: claims.sid }
    const { user: sessionUser } = await setUserSession(event, { user, secure })

    // Make sure the user data matches our expected schema
    const { success: isValidUser, error } = federatedUserSchema.safeParse(sessionUser)
    if (!isValidUser) {
      console.error('Invalid user data', error)
      throw createError({ statusCode: 400, statusMessage: 'Invalid user data', statusText: error?.message })
    }

    return sendRedirect(event, '/')
  }
})
