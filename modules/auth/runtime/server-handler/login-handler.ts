import { login } from '../internal/auth'

/**
 * Redirect to login page of auth provider
 */
export default defineEventHandler(event => login(event))
