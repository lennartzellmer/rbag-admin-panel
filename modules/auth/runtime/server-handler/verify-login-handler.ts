import { verifyLogin } from '../internal/auth'

/**
 * Verify login after redirect from auth provider
 */
export default defineEventHandler(event => verifyLogin(event))
