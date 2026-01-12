import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { ZITADEL_ROLES } from '~~/constants'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  const idpClient = event.context.idpClient
  const runtimeConfig = useRuntimeConfig()

  // =============================================================================
  // Vaidate request
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
  // Ensure that after applying the new roles at least one admin remains
  // That means we need to check if there is only one admin and if
  // the update would remove their admin role
  // =============================================================================

  const { authorizations: adminAuthorizations } = await idpClient.betaAuthorizations.listAuthorizations({
    betaAuthorizationServiceListAuthorizationsRequest: {
      filters: [
        {
          roleKey: {
            key: ZITADEL_ROLES.ADMIN,
            method: 'TEXT_FILTER_METHOD_EQUALS'
          }
        },
        {
          projectId: {
            id: runtimeConfig.zitadel.projectId
          }
        }
      ]
    }
  }).catch((e) => {
    console.error('Error fetching admin authorizations:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify existing admin roles'
    })
  })

  if (!adminAuthorizations || adminAuthorizations.length <= 1) {
    if (adminAuthorizations?.[0].user?.id === id && !roles.includes(ZITADEL_ROLES.ADMIN)) {
      throw createError({
        statusCode: 409,
        statusMessage: 'At least one admin must exist in the project'
      })
    }
  }

  // =============================================================================
  // Update user roles with ZITADEL IDP
  // =============================================================================

  // ensure the role 'user' is always assigned
  const newRoles = [...new Set(roles).add(ZITADEL_ROLES.USER)]

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
  }).catch((e) => {
    console.error('Error fetching user authorizations:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch existing user roles'
    })
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
    roleKeys: newRoles
  }

  await idpClient.betaAuthorizations.updateAuthorization ({
    betaAuthorizationServiceUpdateAuthorizationRequest: payload
  }).catch((_) => {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to set user roles'
    })
  })

  return sendNoContent(event)
})
