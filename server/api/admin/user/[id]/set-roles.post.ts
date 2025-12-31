import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { ZITADEL_ROLES } from '~~/constants'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const ZitadelRoleSchema = z.enum(
    Object.values(ZITADEL_ROLES) as [
    typeof ZITADEL_ROLES[keyof typeof ZITADEL_ROLES],
    ...Array<typeof ZITADEL_ROLES[keyof typeof ZITADEL_ROLES]>
    ]
  )

  const setUserRolesSchema = z.object({
    roles: z.array(ZitadelRoleSchema)
  })

  const { id } = await useValidatedParams(event, z.object({ id: z.string() }))
  const { roles } = await useValidatedBody(event, setUserRolesSchema)

  // =============================================================================
  // Create user in Zitadel
  // =============================================================================
  try {
    const idpClient = event.context.idpClient
    const runtimeConfig = useRuntimeConfig()

    // ensure the role 'user' is always assigned
    if (!roles.includes(ZITADEL_ROLES.USER)) {
      roles.push(ZITADEL_ROLES.USER)
    }

    const { authorizations } = await idpClient.betaAuthorizations.listAuthorizations({
      betaAuthorizationServiceListAuthorizationsRequest: {
        filters: [
          {
            inUserIds: { ids: [id] }
          },
          {
            projectId: {
              id: runtimeConfig.zitadel.projectId
            }
          }
        ]
      }
    })

    const authorization = authorizations?.[0]

    if (!authorization || !authorization.id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No existing authorization found for user'
      })
    }

    const payload = {
      id: authorization.id,
      roleKeys: roles
    }

    await idpClient.betaAuthorizations.updateAuthorization ({
      betaAuthorizationServiceUpdateAuthorizationRequest: payload
    })

    return sendNoContent(event)
  }
  catch (e) {
    console.error('Error setting user roles:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to set user roles'
    })
  }
})
