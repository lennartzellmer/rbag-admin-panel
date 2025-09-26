import { getAuthState } from '../internal/auth'

const runtimeConfig = useRuntimeConfig()
const nonePageRoutes = [
  runtimeConfig.public.auth.authRoute,
  runtimeConfig.public.auth.loginRoute,
  runtimeConfig.public.auth.verifyLoginRoute,
  '/api/'
]

export default defineEventHandler(async (event) => {
  const ignore = nonePageRoutes.some(path => event.path.startsWith(path))
  if (ignore) {
    /**
     * Ignore non page routes
     */
    return
  }

  /**
   * Write auth state to event context in order to pass it to the server side auth plugin
   */
  event.context.auth = await getAuthState(event)
})
