import type { H3Event } from 'h3'
import { createError } from 'h3'
import { federatedUserSchema } from '../domain/user/validation'

export const useAuthenticatedUser = async (event: H3Event) => {
  const { user } = await getUserSession(event)

  const {
    success: isValidUser,
    error: userValidationError,
    data: validatedUserData
  } = await federatedUserSchema.safeParse(user)

  if (!isValidUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data',
      statusText: userValidationError?.message
    })
  }

  return validatedUserData
}
