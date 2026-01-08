import { defineEventHandler } from 'h3'
import { createCommand, handleCommand } from 'vorfall'
import { z } from 'zod'
import { ZITADEL_ROLES } from '~~/constants'
import { createUser, type CreateUser } from '~~/server/domain/user/commandHandling'
import { evolve, getUserStreamSubjectById, initialState } from '~~/server/domain/user/eventHandling'

const ZITADEL_METHODS = {
  AddHumanUser: '/zitadel.user.v2.UserService/AddHumanUser',
  CreateUser: '/zitadel.user.v2.UserService/CreateUser'
} as const

export const AddHumanUserLogSchema = z.object({
  fullMethod: z.literal(ZITADEL_METHODS.AddHumanUser),
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

export const CreateUserLogSchema = z.object({
  fullMethod: z.literal(ZITADEL_METHODS.CreateUser),
  instanceID: z.string(),
  orgID: z.string(),
  userID: z.string(),

  request: z.object({
    organizationId: z.string(),
    human: z.object({
      profile: z.object({
        givenName: z.string(),
        familyName: z.string(),
        preferredLanguage: z.string()
      }),
      email: z.object({
        email: z.email(),
        isVerified: z.boolean()
      }),
      password: z.object({
        password: z.string()
      })
    })
  }),

  response: z.object({
    id: z.string(),
    creationDate: z.iso.datetime()
  }),
  headers: z.record(z.string(), z.unknown())
})

const requestSchemas = z.union([AddHumanUserLogSchema, CreateUserLogSchema])

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Create user in Zitadel
  // =============================================================================
  try {
    const idpClient = event.context.idpClient
    const runtimeConfig = useRuntimeConfig()
    const body = await useValidatedBody(event, requestSchemas)

    const userRoleKeys = [ZITADEL_ROLES.ADMIN, ZITADEL_ROLES.USER]

    const userId = body.fullMethod === ZITADEL_METHODS.AddHumanUser
      ? body.response.userId
      : body.response.id

    const userEmail = body.fullMethod === ZITADEL_METHODS.AddHumanUser
      ? body.request.email.email
      : body.request.human.email.email

    const payload = {
      userId: userId,
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
        id: userId
      },
      metadata: {
        requestedBy: {
          userId: body.userID,
          email: userEmail
        },
        now: new Date()
      }
    })

    await handleCommand({
      eventStore,
      streams: [{
        evolve,
        initialState,
        streamSubject: getUserStreamSubjectById(userId)
      }],
      commandHandlerFunction: createUser,
      command: command
    })

    sendNoContent(event, 204)
  }
  catch (e) {
    console.error('Error creating user from Zitadel webhook:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
