import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { useValidatedBody } from '~~/server/utils/useValidated'

const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================
  const {
    firstName,
    lastName,
    email,
    password
  } = await useValidatedBody(event, signUpSchema)

  // =============================================================================
  // Create user in Zitadel
  // =============================================================================
  try {
    const idpClient = event.context.idpClient
    const displayName = `${firstName} ${lastName}`.trim()

    const user = await idpClient.management.users.createHumanUser({
      profile: {
        firstName,
        lastName,
        displayName
      },
      email: {
        email,
        isEmailVerified: false
      },
      password: {
        password,
        changeRequired: false
      },
      userName: email
    })

    return {
      data: user
    }
  }
  catch (error) {
    console.error('Failed to create user', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
