// TypeScript reimplementation of the provided Go module
// https://github.com/zitadel/zitadel-go/blob/main/pkg/actions/signing.go
//
import { createHmac, timingSafeEqual } from 'crypto'
import type { H3Event, EventHandlerRequest } from 'H3'

export const ErrNoValidSignature = new Error('no valid signature')
export const ErrTooOld = new Error('timestamp wasn\'t within tolerance')
export const ErrInvalidHeader = new Error('request has invalid Zitadel-Signature header')
export const ErrInvalidBody = new Error('request has invalid body')

export const SigningHeader = 'ZITADEL-Signature'
const signingTimestamp = 't'
const signingVersion = 'v1'
export const DefaultToleranceSeconds = 300 // 300s == 5min
const partSeparator = ','

type SignedHeader = {
  timestamp: Date // defaults to epoch if missing
  signatures: Buffer[] // decoded hex
}

function computeSignature(timestamp: Date, payload: Uint8Array, signingKey: string): Buffer {
  const unix = Math.floor(timestamp.getTime() / 1000)
  const mac = createHmac('sha256', Buffer.from(signingKey, 'utf8'))
  mac.update(String(unix), 'utf8')
  mac.update('.', 'utf8')
  mac.update(Buffer.from(payload))
  return mac.digest()
}

/**
 * Compute the ZITADEL-Signature header value for a given payload and timestamp.
 * Matches Go: "t=<unix>,v1=<hexsig>[,v1=<hexsig>...]"
 */
export function computeSignatureHeader(
  t: Date,
  payload: Uint8Array,
  ...signingKeys: string[]
): string {
  const parts: string[] = [`${signingTimestamp}=${Math.floor(t.getTime() / 1000)}`]
  for (const k of signingKeys) {
    const sigHex = computeSignature(t, payload, k).toString('hex')
    parts.push(`${signingVersion}=${sigHex}`)
  }
  return parts.join(partSeparator)
}

/**
 * Validate the request payload against the signature.
 */
export async function validateSigningHeader(
  event: H3Event<EventHandlerRequest>,
  signingKey: string
): Promise<{ valid: true, error?: undefined } | { valid: false, error: string }> {
  const body = await readRawBody(event, 'utf-8')
  const signingHeader = getRequestHeader(event, 'zitadel-signature')

  if (!body) {
    return { valid: false, error: ErrInvalidHeader.message }
  }
  if (!signingHeader) {
    return { valid: false, error: ErrInvalidHeader.message }
  }

  const bytes = new TextEncoder().encode(body)
  return validatePayloadWithTolerance(
    bytes,
    signingHeader,
    signingKey,
    DefaultToleranceSeconds,
    true
  )
}

/**
 * Validate payload with a given tolerance (seconds), equivalent to Go DefaultTolerance time.Duration.
 * Returns a validation result instead of throwing.
 */
function validatePayloadWithTolerance(
  payload: Uint8Array,
  sigHeader: string,
  signingKey: string,
  toleranceSeconds: number,
  enforceTolerance: boolean
): { valid: true, error?: undefined } | { valid: false, error: string } {
  try {
    const header = parseSignatureHeader(sigHeader)

    const expected = computeSignature(header.timestamp, payload, signingKey)

    if (enforceTolerance) {
      const ageMs = Date.now() - header.timestamp.getTime()
      if (ageMs > toleranceSeconds * 1000) {
        return { valid: false, error: ErrTooOld.message }
      }
    }

    for (const sig of header.signatures) {
      if (sig.length !== expected.length) continue
      if (timingSafeEqual(expected, sig)) {
        return { valid: true }
      }
    }

    return { valid: false, error: ErrNoValidSignature.message }
  }
  catch (err) {
    if (err instanceof Error) {
      return { valid: false, error: err.message }
    }
    return { valid: false, error: ErrInvalidHeader.message }
  }
}

function parseSignatureHeader(header: string): SignedHeader {
  const sh: SignedHeader = { timestamp: new Date(0), signatures: [] }

  const pairs = header.split(',')
  for (const pair of pairs) {
    const parts = pair.split('=')
    if (parts.length !== 2) throw ErrInvalidHeader

    const key = parts[0]
    const value = parts[1]

    switch (key) {
      case signingTimestamp: {
        if (!value) throw ErrInvalidHeader
        const ts = Number.parseInt(value, 10)
        if (!Number.isFinite(ts)) throw ErrInvalidHeader
        sh.timestamp = new Date(ts * 1000)
        break
      }
      case signingVersion: {
        try {
          const buf = Buffer.from(value, 'hex')
          // Buffer.from(hex) doesn't throw on all invalid strings; enforce even-length + valid chars.
          if (value.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(value)) break
          sh.signatures.push(buf)
        }
        catch {
          // ignore invalid v1 parts
        }
        break
      }
      default:
        // ignore unknown parts
        break
    }
  }

  if (sh.signatures.length === 0) throw ErrNoValidSignature
  return sh
}
