import { extractAuthUser, validateAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) {
    const runtimeConfig = useRuntimeConfig()
    if (!runtimeConfig.auth.enabled) {
      return
    }
    const authConfig = {
      jwksUri: runtimeConfig.auth.jwksUri,
      audience: runtimeConfig.auth.audience,
      issuer: runtimeConfig.auth.issuer
    }
    await validateAuth(event, authConfig)

    const user = extractAuthUser(event)

    if (!user.roles.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        statusText: 'Access to this resource is restricted. The user does not have the required access rights.'
      })
    }
  }
})
