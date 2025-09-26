import type { H3Event } from 'h3'
import * as client from 'openid-client'
import { useAuthSession } from '../auth-session'
import type { AuthState } from './auth-state'
import type { AuthUser } from './auth-user'
import { authUserSchema } from './auth-user'
import { queryKeys } from './constant'

const runtimeConfig = useRuntimeConfig()

function getVerifyLoginUrl(event: H3Event) {
  const url = getRequestURL(event)
  url.pathname = runtimeConfig.public.auth.verifyLoginRoute
  url.search = ''
  return url.toString()
}

function getPostLogoutUrl(event: H3Event) {
  const url = getRequestURL(event)
  url.pathname = runtimeConfig.public.auth.postLogoutRoute
  url.search = ''
  return url.toString()
}

let clientConfig: client.Configuration | null = null

async function getClientConfig() {
  if (!clientConfig) {
    clientConfig = await client.discovery(
      new URL(runtimeConfig.auth.issuer),
      runtimeConfig.auth.clientId,
      runtimeConfig.auth.clientSecret
    )
  }
  return clientConfig
}

function parseClaims(tokens: client.TokenEndpointResponseHelpers): AuthUser | null {
  const result = authUserSchema.safeParse(tokens.claims())
  if (result.success) {
    return result.data
  }
  return null
}

export async function login(event: H3Event) {
  const query = getQuery(event)
  const postLoginRoute = query[queryKeys.POST_LOGIN_ROUTE]
  const config = await getClientConfig()
  const codeVerifier = client.randomPKCECodeVerifier()
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)
  const state = client.randomState()
  const parameters: Record<string, string> = {
    redirect_uri: getVerifyLoginUrl(event),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state
  }
  const authorizationUrl = client.buildAuthorizationUrl(config, parameters)

  const session = await useAuthSession(event)
  await session.setChallenge({
    codeVerifier,
    state,
    postLoginRoute:
      typeof postLoginRoute === 'string'
        ? postLoginRoute
        : runtimeConfig.public.auth.defaultPostLoginRoute
  })

  return sendRedirect(event, authorizationUrl.toString())
}

export async function logout(event: H3Event) {
  const endSessionUrl = client.buildEndSessionUrl(await getClientConfig(), {
    logout_uri: getPostLogoutUrl(event)
  })

  const session = await useAuthSession(event)
  await session.clear()

  return sendRedirect(event, endSessionUrl.toString())
}

export async function verifyLogin(event: H3Event) {
  const session = await useAuthSession(event)
  const challengeSession = await session.getChallenge()

  if (!challengeSession) {
    return logout(event)
  }

  const { postLoginRoute } = challengeSession
  const config = await getClientConfig()
  const tokens = await client.authorizationCodeGrant(config, getRequestURL(event), {
    pkceCodeVerifier: challengeSession.codeVerifier,
    expectedState: challengeSession.state
  })

  if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_in) {
    return logout(event)
  }

  const user = parseClaims(tokens)
  if (!user) {
    return logout(event)
  }

  await session.setAuthenticated({
    user,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token
  })

  return sendRedirect(event, postLoginRoute)
}

export async function getAuthState(event: H3Event): Promise<AuthState> {
  const session = await useAuthSession(event)
  let authenticated = await session.getAuthenticated()

  if (!authenticated) {
    return {
      state: 'unauthenticated'
    }
  }

  try {
    const config = await getClientConfig()
    const { refreshToken } = authenticated
    const refreshedTokens = await client.refreshTokenGrant(config, refreshToken)

    if (!refreshedTokens.access_token || !refreshedTokens.expires_in) {
      await session.clear()
      return {
        state: 'unauthenticated'
      }
    }

    const user = parseClaims(refreshedTokens)
    if (!user) {
      await session.clear()
      return {
        state: 'unauthenticated'
      }
    }

    await session.setAuthenticated({
      user,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || refreshToken
    })

    authenticated = await session.getAuthenticated()
    if (!authenticated) {
      await session.clear()
      return {
        state: 'unauthenticated'
      }
    }

    return {
      state: 'authenticated',
      user: authenticated.user,
      expiresAt: authenticated.expiresAt
    }
  }
  catch (error) {
    console.error(error)
    await session.clear()
    return {
      state: 'unauthenticated'
    }
  }
}
