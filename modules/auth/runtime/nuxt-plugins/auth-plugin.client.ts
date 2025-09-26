import type { AuthState } from '../internal/auth-state'
import { useAuthState } from '../internal/auth-state'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authState = useAuthState()
  const runtimeConfig = useRuntimeConfig()

  if (authState.value.state === 'idle') {
    /**
     * Initialize auth state in case of client side rendering (ssr: false)
     */
    authState.value = await $fetch<AuthState>(runtimeConfig.public.auth.authRoute)
  }

  /**
   * Refresh
   */
  let refreshTimeout: NodeJS.Timeout | null = null

  const killRefreshTimeout = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
  }

  const startRefreshTimeout = () => {
    killRefreshTimeout()

    if (authState.value.state === 'authenticated') {
      const { expiresAt } = authState.value
      const difference = expiresAt - Date.now()
      const delay = Math.max(
        difference - runtimeConfig.public.auth.refreshThresholdInSeconds * 1000,
        0
      )
      refreshTimeout = setTimeout(async () => {
        refreshTimeout = null
        try {
          authState.value = await $fetch<AuthState>(runtimeConfig.public.auth.authRoute)
        }
        catch (error) {
          console.error(error)
          authState.value = { state: 'unauthenticated' }
        }
        finally {
          startRefreshTimeout()
        }
      }, delay)
    }
  }

  nuxtApp.hook('app:mounted', () => {
    startRefreshTimeout()

    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        startRefreshTimeout()
      }
      else {
        killRefreshTimeout()
      }
    })
  })
})
