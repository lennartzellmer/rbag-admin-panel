import { useAuthState } from '../internal/auth-state'

export default defineNuxtPlugin(async (_) => {
  const authState = useAuthState()

  if (authState.value.state === 'idle') {
    /**
     * Initialize auth state in case of server side rendering (ssr: true)
     */
    const event = useRequestEvent()
    if (!event) {
      authState.value = { state: 'unauthenticated' }
      return
    }
    authState.value = event.context.auth || { state: 'unauthenticated' }
  }
})
