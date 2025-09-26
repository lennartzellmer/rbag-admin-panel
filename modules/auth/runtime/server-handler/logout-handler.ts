import { logout } from '../internal/auth'

/**
 * Clear user session
 */
export default defineEventHandler(event => logout(event))
