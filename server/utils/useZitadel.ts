import type Zitadel from '@zitadel/zitadel-node/dist'
import type { UserServiceHumanUser } from '@zitadel/zitadel-node/dist/models/user-service-human-user.js'
import type { UserServiceUser } from '@zitadel/zitadel-node/dist/models/user-service-user.js'

// =============================================================================
// Types
// =============================================================================

export type EnrichedUserDetailFields = {
  givenName: string
  familyName: string
  email: {
    email: string
    isVerified: boolean
  }
}

export type EnrichedUserRoleFields = {
  roles: Array<string>
}

type HumanUser = UserServiceUser & { human: UserServiceHumanUser }

const isHumanUser = (user: UserServiceUser): user is HumanUser => Boolean(user.human)

export const enrichWithUserDetails = async <T extends { id: string }>(
  idpClient: Zitadel,
  users: T[]
): Promise<Array<T & EnrichedUserDetailFields>> => {
  const userIds = users.map(user => user.id)

  const userDetails = await idpClient.betaUsers.listUsers({
    betaUserServiceListUsersRequest: {
      queries: [{
        inUserIdsQuery: { userIds }
      }]
    }
  })

  const humanUsers = (userDetails.result ?? []).filter(isHumanUser)
  const humanUsersById = new Map<string, HumanUser>(
    humanUsers.map(detail => [detail.userId ?? detail.human.userId ?? '', detail])
  )

  return users.map((user) => {
    const human = humanUsersById.get(user.id)?.human

    return {
      ...user,
      givenName: human?.profile?.givenName ?? '',
      familyName: human?.profile?.familyName ?? '',
      email: {
        email: human?.email?.email ?? '',
        isVerified: human?.email?.isVerified ?? false
      }
    }
  })
}

export const enrichWithUserRoles = async <T extends { id: string }>(
  idpClient: Zitadel,
  users: T[]
): Promise<Array<T & EnrichedUserGrantFields>> => {
  const userIds = users.map(user => user.id)

  const runtimeConfig = useRuntimeConfig()

  const userAuths = await idpClient.betaAuthorizations.listAuthorizations({
    betaAuthorizationServiceListAuthorizationsRequest: {
      filters: [
        {
          inUserIds: { ids: userIds }
        },
        {
          projectId: {
            id: runtimeConfig.zitadel.projectId
          }
        }
      ]
    }
  })

  return users.map((user) => {
    const roles = userAuths.authorizations?.filter(auth => auth.user?.id === user.id).map(auth => auth.roles ?? []).flat(1) ?? []

    return {
      ...user,
      roles
    }
  })
}
