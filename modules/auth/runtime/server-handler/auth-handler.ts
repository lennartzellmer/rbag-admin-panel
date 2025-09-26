import { getAuthState } from '../internal/auth'

/**
 * Return auth state for client side rendered app (ssr: false)
 */
export default defineEventHandler(event => getAuthState(event))
