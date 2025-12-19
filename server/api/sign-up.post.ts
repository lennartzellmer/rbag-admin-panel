import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { useValidatedBody } from '~~/server/utils/useValidated'
import { randomUUID } from 'crypto'

const signUpSchema = z.object({
  givenName: z.string().min(1),
  familyName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================
  const {
    givenName,
    familyName,
    email,
    password
  } = await useValidatedBody(event, signUpSchema)

  // =============================================================================
  // Create user in Zitadel
  // =============================================================================
  try {
    const idpClient = event.context.idpClient
    const runtimeConfig = useRuntimeConfig()
    const displayName = `${givenName} ${familyName}`.trim()

    const user = await idpClient.users.addHumanUser({
      userServiceAddHumanUserRequest: {
        organization: {
          orgId: runtimeConfig.zitadel.orgId
        },
        userId: randomUUID(),
        username: email,
        profile: {
          givenName,
          familyName,
          displayName,
          preferredLanguage: 'de'
        },
        email: {
          email,
          isVerified: false
        },
        password: {
          password,
          changeRequired: false
        }
      }
    })

    await idpClient.betaAuthorizations.createAuthorization({
      betaAuthorizationServiceCreateAuthorizationRequest: {
        userId: user.userId,
        projectId: runtimeConfig.zitadel.projectId,
        roleKeys: ['user']
      }
    })

    await idpClient.users.sendEmailCode({
      userServiceSendEmailCodeRequest: {
        userId: user.userId
      }
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
