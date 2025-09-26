import type { AuthUser } from './auth-user'

interface AuthStateIdle {
  state: 'idle'
}

interface AuthStateAuthenticated {
  state: 'authenticated'
  user: AuthUser
  expiresAt: number
}

interface AuthStateUnauthenticated {
  state: 'unauthenticated'
}

export type AuthState = AuthStateIdle | AuthStateAuthenticated | AuthStateUnauthenticated

const stateKey = 'auth-state'

const useAuthState = () =>
  useState<AuthState>(stateKey, () => {
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context.auth) {
        return event.context.auth
      }
    }
    return { state: 'idle' }
  })

export { useAuthState }
