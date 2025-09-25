import type { H3Event } from 'h3'
import { createError, getRequestHeader } from 'h3'
import { createRemoteJWKSet, decodeJwt, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose'
import { ZITADEL_EMAIL_CLAIM, ZITADEL_ROLE_CLAIM, ZITADEL_USERID_CLAIM } from '~~/constants'

export type AuthUser = { id: string, email: string, roles: string[] }

type AuthConfig = {
  jwksUri: string
  issuer: string
  audience?: string | string[]
}

let remoteJwkSet: JWTVerifyGetKey | null = null

/**
 * Resolve and cache a process-wide RemoteJWKSet.
 * In a single-issuer setup, the JWKS URI does not change at runtime,
 * so we lazily initialize once and reuse for subsequent verifications.
 */
function resolveRemoteJwkSet(jwksUri: string): JWTVerifyGetKey {
  if (remoteJwkSet === null) {
    remoteJwkSet = createRemoteJWKSet(new URL(jwksUri))
  }

  return remoteJwkSet
}

/**
 * Resolve the email from the payload.
 */
function resolveEmail(payload: JWTPayload): string | null {
  if (typeof payload[ZITADEL_EMAIL_CLAIM] === 'string') {
    return payload[ZITADEL_EMAIL_CLAIM]
  }
  return null
}

/**
 * Resolve the user ID from the payload.
 */
function resolveUserId(payload: JWTPayload): string | null {
  if (typeof payload[ZITADEL_USERID_CLAIM] === 'string') {
    return payload[ZITADEL_USERID_CLAIM]
  }
  return null
}

/**
 * Extract the roles from the payload.
 */
function resolveRoles(payload: JWTPayload): string[] {
  const rawRoles = payload[ZITADEL_ROLE_CLAIM]

  if (!rawRoles || !Array.isArray(rawRoles)) {
    return []
  }

  const roles = new Set<string>()

  for (const role of rawRoles) {
    if (typeof role === 'string' && role.length > 0) {
      roles.add(role)
    }
  }

  return Array.from(roles).sort()
}

/**
 * Validate the Authorization bearer token from the incoming request.
 *
 * @param event H3Event carrying the HTTP request from which to read the Authorization header.
 * @param config Auth configuration including `jwksUri`, `issuer`, and optional `audience`.
 * @returns Promise that resolves to a discriminated union indicating validity and, on success, the authenticated user.
 */
export async function validateAuth(event: H3Event, config: AuthConfig): Promise<void> {
  const { jwksUri, issuer, audience } = config

  if (!jwksUri || !issuer || !audience) {
    console.error('Auth configuration is incomplete.')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      statusText: 'Auth configuration is incomplete.'
    })
  }

  // =============================================================================
  // Get the token from the Authorization header
  // =============================================================================

  const authorizationHeader = getRequestHeader(event, 'authorization')

  if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      statusText: 'Invalid Authorization header.'
    })
  }

  const token = authorizationHeader.slice('Bearer '.length).trim()

  if (token.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      statusText: 'Invalid Authorization header.'
    })
  }

  // =============================================================================
  // Verify the token
  // =============================================================================

  try {
    const key = resolveRemoteJwkSet(jwksUri)
    const verifyOptions = {
      issuer,
      audience: Array.isArray(audience) ? audience : [audience]
    }
    await jwtVerify(token, key, verifyOptions)
  }
  catch (error) {
    console.error('Failed to verify access token.', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      statusText: 'Failed to verify access token.'
    })
  }
}

/**
 * Decode the Authorization bearer token to extract user claims without verifying the signature.
 * This should only be used in trusted environments where the token has already been verified.
 *
 * @param event H3Event carrying the HTTP request from which to read the Authorization header.
 * @returns The authenticated user extracted from the token claims.
 * @throws An H3Error with status code 401 if the token is missing or invalid.
 */
export function extractAuthUser(event: H3Event): AuthUser {
  const authorizationHeader = getRequestHeader(event, 'authorization')

  if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not extract user from auth token',
      statusText: 'Invalid Authorization header.'
    })
  }

  const token = authorizationHeader.slice('Bearer '.length).trim()

  if (token.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not extract user from auth token',
      statusText: 'Invalid Authorization header.'
    })
  }

  try {
    const payload = decodeJwt(token)

    const userId = resolveUserId(payload)
    const email = resolveEmail(payload)
    const roles = resolveRoles(payload)

    if (!userId || !email || roles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Could not extract user from auth token',
        statusText: 'Invalid Authorization header.'
      })
    }

    return {
      id: userId,
      email,
      roles
    }
  }
  catch (error) {
    console.error('Failed to decode access token.', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Could not extract user from auth token',
      statusText: 'Invalid Authorization header.'
    })
  }
}
