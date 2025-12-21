import { defineEventHandler } from 'h3'
import { z } from 'zod'

export const AddHumanUserLogSchema = z.object({
  fullMethod: z.string(), // or z.literal("/zitadel.user.v2.UserService/AddHumanUser")
  instanceID: z.string(),
  orgID: z.string(),
  projectID: z.string().optional(),
  userID: z.string(),
  request: z.record(z.string(), z.unknown()),
  response: z.object({
    userId: z.string(),
    details: z.record(z.string(), z.unknown())
  }),
  headers: z.record(z.string(), z.unknown())
})

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Create user in Zitadel
  // =============================================================================
  try {
    const idpClient = event.context.idpClient
    const runtimeConfig = useRuntimeConfig()

    const body = await useValidatedBody(event, AddHumanUserLogSchema)

    const payload = {
      userId: body.response.userId,
      organizationId: runtimeConfig.zitadel.orgId,
      projectId: runtimeConfig.zitadel.projectId,
      roleKeys: ['user']
    }

    await idpClient.betaAuthorizations.createAuthorization({
      betaAuthorizationServiceCreateAuthorizationRequest: payload
    })

    sendNoContent(event, 204)
  }
  catch (error) {
    console.error('Failed to create user', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
