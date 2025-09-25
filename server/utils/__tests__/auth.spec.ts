import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { jwtVerify } from 'jose'
import type { H3Event } from 'h3'
import { validateAuth, extractAuthUser } from '~~/server/utils/auth'
import { createTestJwt, TEST_JWT_PAYLOAD } from '~~/test/utils/jwt'
import { ZITADEL_EMAIL_CLAIM, ZITADEL_ROLE_CLAIM, ZITADEL_USERID_CLAIM } from '~~/constants'

// =============================================================================
// Test helpers
// =============================================================================

function createEvent(authorizationHeader?: string): H3Event {
  const headers: Record<string, string> = {}
  if (authorizationHeader) headers.authorization = authorizationHeader

  // Minimal shape for h3's getRequestHeader helper
  return {
    node: {
      req: { headers }
    }
  } as unknown as H3Event
}

// Partially mock jose to control jwtVerify behavior while keeping other exports intact
vi.mock('jose', async (importOriginal) => {
  const original = await (importOriginal as unknown as () => Promise<Record<string, unknown>>)()
  return {
    ...original,
    // Provide a stable default; tests will override per-case via jest/vi spy API
    jwtVerify: vi.fn().mockResolvedValue({ payload: {} }),
    createRemoteJWKSet: vi.fn(() => ({} as unknown))
  }
})

describe('Server auth utils', () => {
  const baseConfig = {
    jwksUri: 'https://example.com/.well-known/jwks.json',
    issuer: 'https://example.com/',
    audience: 'hub-admin-panel'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =============================================================================
  // validateAuth
  // =============================================================================

  describe('validateAuth', () => {
    it('verifies a valid bearer token and does not throw', async () => {
      const token = await createTestJwt()
      const event = createEvent(`Bearer ${token}`)

      ;(jwtVerify as unknown as Mock).mockResolvedValueOnce({ payload: {} })

      await expect(validateAuth(event, baseConfig)).resolves.toBeUndefined()
      expect(jwtVerify).toHaveBeenCalledTimes(1)
    })

    it('throws 401 when auth runtime configuration is incomplete', async () => {
      const token = await createTestJwt()
      const event = createEvent(`Bearer ${token}`)

      const configMissingAudience = { jwksUri: baseConfig.jwksUri, issuer: baseConfig.issuer }
      await expect(validateAuth(event, configMissingAudience)).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
      expect(jwtVerify).not.toHaveBeenCalled()
    })

    it('throws 401 for missing Authorization header', async () => {
      const event = createEvent()
      await expect(validateAuth(event, baseConfig)).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
      expect(jwtVerify).not.toHaveBeenCalled()
    })

    it('throws 401 when token verification fails', async () => {
      const token = await createTestJwt()
      const event = createEvent(`Bearer ${token}`)

      ;(jwtVerify as unknown as Mock).mockRejectedValueOnce(new Error('invalid'))

      await expect(validateAuth(event, baseConfig)).rejects.toMatchObject({ statusCode: 401, statusMessage: 'Unauthorized' })
      expect(jwtVerify).toHaveBeenCalledTimes(1)
    })
  })

  // =============================================================================
  // extractAuthUser
  // =============================================================================

  describe('extractAuthUser', () => {
    it('extracts the user from a valid token', async () => {
      const token = await createTestJwt()
      const event = createEvent(`Bearer ${token}`)

      const user = extractAuthUser(event)
      expect(user).toEqual({
        id: TEST_JWT_PAYLOAD[ZITADEL_USERID_CLAIM],
        email: TEST_JWT_PAYLOAD[ZITADEL_EMAIL_CLAIM],
        roles: TEST_JWT_PAYLOAD[ZITADEL_ROLE_CLAIM]
      })
    })

    it('throws 400 for missing Authorization header', () => {
      const event = createEvent()
      expect(() => extractAuthUser(event)).toThrowError(
        expect.objectContaining({ statusCode: 400 })
      )
    })

    it('throws 400 for empty token', () => {
      const event = createEvent('Bearer ')
      expect(() => extractAuthUser(event)).toThrowError(
        expect.objectContaining({ statusCode: 400 })
      )
    })

    it('throws 401 when required claims are missing or invalid', async () => {
      // Build a token with empty roles array to trigger validation failure
      const invalidPayload = {
        [ZITADEL_USERID_CLAIM]: 'user-1',
        [ZITADEL_EMAIL_CLAIM]: 'user@example.com',
        [ZITADEL_ROLE_CLAIM]: []
      }
      const token = await createTestJwt(invalidPayload)
      const event = createEvent(`Bearer ${token}`)

      expect(() => extractAuthUser(event)).toThrowError(expect.objectContaining({ statusCode: 401 }))
    })

    it('throws 401 when token cannot be decoded', async () => {
      // Provide a clearly invalid token string
      const event = createEvent('Bearer not-a-jwt')
      expect(() => extractAuthUser(event)).toThrowError(
        expect.objectContaining({ statusCode: 401 })
      )
    })
  })
})
