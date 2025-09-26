import type { H3Event } from 'h3'

interface Challenge {
  codeVerifier: string
  state?: string
  postLoginRoute: string
}

interface Authenticated {
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
  expiresAt: number
  accessToken: string
  refreshToken: string
}

interface AuthSession {
  getChallenge: () => Promise<Challenge | null>
  setChallenge: (value: Challenge) => Promise<void>
  getAuthenticated: () => Promise<Authenticated | null>
  setAuthenticated: (value: Authenticated) => Promise<void>
  clear: () => Promise<void>
}

export async function useAuthSession(event: H3Event): Promise<AuthSession> {
  const config = useRuntimeConfig()

  const baseSession = await useSession<{ type: 'challenge' | 'authenticated' }>(event, {
    name: 'base',
    password: config.auth.sessionPassword,
    maxAge: config.auth.sessionTTL
  })

  const challengeSession = await useSession<Challenge>(event, {
    name: 'challenge',
    password: config.auth.sessionPassword,
    maxAge: config.auth.sessionTTL
  })

  const authenticatedSession = await useSession<Pick<Authenticated, 'user' | 'expiresAt'>>(event, {
    name: 'authenticated',
    password: config.auth.sessionPassword,
    maxAge: config.auth.sessionTTL
  })

  const accessTokenSession = await useSession<Pick<Authenticated, 'accessToken'>>(event, {
    name: 'access',
    password: config.auth.sessionPassword,
    maxAge: config.auth.sessionTTL
  })

  const refreshTokenSession = await useSession<Pick<Authenticated, 'refreshToken'>>(event, {
    name: 'refresh',
    password: config.auth.sessionPassword,
    maxAge: config.auth.sessionTTL
  })

  const authSession: AuthSession = {
    getChallenge: async () => {
      if (baseSession.data.type !== 'challenge') {
        return null
      }

      if (!challengeSession.data) {
        return null
      }

      return challengeSession.data
    },
    setChallenge: async (value: Challenge) => {
      await authenticatedSession.clear()
      await accessTokenSession.clear()
      await refreshTokenSession.clear()
      await baseSession.update({ type: 'challenge' })
      await challengeSession.update(value)
    },
    getAuthenticated: async () => {
      if (baseSession.data.type !== 'authenticated') {
        return null
      }

      if (!authenticatedSession.data || !accessTokenSession.data || !refreshTokenSession.data) {
        return null
      }

      return {
        user: authenticatedSession.data.user,
        expiresAt: authenticatedSession.data.expiresAt,
        accessToken: accessTokenSession.data.accessToken,
        refreshToken: refreshTokenSession.data.refreshToken
      }
    },
    setAuthenticated: async ({ user, expiresAt, accessToken, refreshToken }: Authenticated) => {
      await challengeSession.clear()
      await baseSession.update({ type: 'authenticated' })
      await authenticatedSession.update({ user, expiresAt })
      await accessTokenSession.update({ accessToken })
      await refreshTokenSession.update({ refreshToken })
    },
    clear: async () => {
      await baseSession.clear()
      await challengeSession.clear()
      await authenticatedSession.clear()
      await accessTokenSession.clear()
      await refreshTokenSession.clear()
    }
  }

  return authSession
}
