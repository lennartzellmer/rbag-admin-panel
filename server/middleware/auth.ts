import { validateAuth } from '../utils/auth'

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
    const result = await validateAuth(event, authConfig)

    event.context.user = result.user
  }
})
