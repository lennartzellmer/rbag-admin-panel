import { SignJWT } from 'jose'

export const TEST_JWT_SECRET = 'a-string-secret-at-least-256-bits-long'

export const TEST_JWT_PAYLOAD = {
  sub: '1234567890',
  email: 'test@rbag-musik.de',
  roles: ['admin']
} as const

export const TEST_JWT_HEADER = {
  alg: 'HS256',
  typ: 'JWT'
} as const

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(TEST_JWT_SECRET)
}

/**
 * Creates a signed JWT for tests with HS256.
 * If no payload is provided, a standard default payload is used.
 */
export async function createTestJwt(payload?: Record<string, unknown>): Promise<string> {
  const effectivePayload = payload ?? { ...TEST_JWT_PAYLOAD }
  const token = await new SignJWT({ ...effectivePayload })
    .setProtectedHeader({ ...TEST_JWT_HEADER })
    .sign(getSecretKey())

  return token
}
