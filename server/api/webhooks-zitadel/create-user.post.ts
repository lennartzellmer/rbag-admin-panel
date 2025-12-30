import { defineEventHandler } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { z } from 'zod'
import { ZITADEL_ROLES } from '~~/constants'
import { createUser, type CreateUser } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'

export const AddHumanUserLogSchema = z.object({
  fullMethod: z.string(), // or z.literal("/zitadel.user.v2.UserService/AddHumanUser")
  instanceID: z.string(),
  orgID: z.string(),
  projectID: z.string().optional(),
  userID: z.string(),
  request: z.object({
    username: z.string(),
    organization: z.object({
      orgId: z.string()
    }),
    profile: z.object({
      givenName: z.string(),
      familyName: z.string()
    }),
    email: z.object({
      email: z.email(),
      isVerified: z.boolean()
    }),
    password: z.object({
      password: z.string()
    })
  }),
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

    const userRoleKeys = [ZITADEL_ROLES.ADMIN, ZITADEL_ROLES.USER]

    const payload = {
      userId: body.response.userId,
      organizationId: runtimeConfig.zitadel.orgId,
      projectId: runtimeConfig.zitadel.projectId,
      roleKeys: userRoleKeys
    }

    await idpClient.betaAuthorizations.createAuthorization({
      betaAuthorizationServiceCreateAuthorizationRequest: payload
    })

    const eventStore = event.context.eventStore

    const command: CreateUser = createCommand({
      type: 'CreateUser',
      data: {
        id: body.response.userId
      },
      metadata: {
        requestedBy: {
          userId: body.userID,
          email: body.request.email.email
        },
        now: new Date()
      }
    })

    await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(body.response.userId)
      }],
      commandHandlerFunction: createUser,
      command: command
    })

    sendNoContent(event, 204)
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
