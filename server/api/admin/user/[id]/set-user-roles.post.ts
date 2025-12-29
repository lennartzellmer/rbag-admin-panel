import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { useValidatedBody } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================
  const setUserRolesSchema = z.object({
    roles: z.array(z.string())
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
    if (!roles.includes('user')) {
      roles.push('user')
    }

    const payload = {
      userId: id,
      organizationId: runtimeConfig.zitadel.orgId,
      projectId: runtimeConfig.zitadel.projectId,
      roleKeys: roles
    }

    await idpClient.betaAuthorizations.createAuthorization({
      betaAuthorizationServiceCreateAuthorizationRequest: payload
    })
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }

  const updatedUser = await $fetch(`/api/admin/user/${id}`, {
    method: 'GET',
    params: { id }
  })

  if (!updatedUser.error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch updated user'
    })
  }

  return updatedUser.data
})
