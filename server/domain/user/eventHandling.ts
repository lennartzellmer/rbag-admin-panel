import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject } from 'vorfall'
import type { DomainEvent, Subject } from 'vorfall'
import type { AttachProfileImageSchema, User } from './validation'
import type { RbagEventStoreInstance } from '~~/server/plugins/eventStore'

export const UserEntity = 'User'
export type UserSubject = Subject<`${typeof UserEntity}`>
export const getUserStreamSubjectById = (id: string) => createStreamSubject(`${UserEntity}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type UserEventMetadata = {
  requestedBy: {
    userId: string
    email: string
  }
}

export type UserCreated = DomainEvent<
  'UserCreated',
  User,
  UserEventMetadata,
  UserSubject
>

export type UserProfileImageAttached = DomainEvent<
  'UserProfileImageAttached',
  AttachProfileImageSchema,
  UserEventMetadata,
  UserSubject
>

export type UserProfileImageRemoved = DomainEvent<
  'UserProfileImageRemoved',
  undefined,
  UserEventMetadata,
  UserSubject
>

export type UserEvents = UserCreated | UserProfileImageAttached | UserProfileImageRemoved

// =============================================================================
// Evolve
// =============================================================================

export const initialState = () => null

export const evolve = (state: User, event: UserEvents): User => {
  const { type, data } = event

  switch (type) {
    case 'UserCreated': {
      return {
        ...state,
        ...data
      }
    }
    case 'UserProfileImageAttached': {
      return {
        ...state,
        profileImage: data.profileImageKey
      }
    }
    case 'UserProfileImageRemoved': {
      return {
        ...state,
        profileImage: undefined
      }
    }
    default: {
      const _exhaustiveCheck: never = type as never
      return state
    }
  }
}

// =============================================================================
// Projections
// =============================================================================

export const UserProjectionName = 'User' as const

export const userProjectionDefinition = createProjectionDefinition({
  name: UserProjectionName,
  evolve,
  canHandle: ['UserCreated', 'UserProfileImageAttached', 'UserProfileImageRemoved'],
  initialState
})

export const getUsersPaginated = (
  eventStore: RbagEventStoreInstance,
  skip: number,
  limit: number
) => findMultipleProjections(
  eventStore,
  UserEntity,
  {
    projectionName: UserProjectionName
  },
  {
    skip,
    limit
  }
)

export const getUserCount = (eventStore: RbagEventStoreInstance) => countProjections(
  eventStore,
  UserEntity,
  {
    projectionName: UserProjectionName
  }
)

export const getUserById = (eventStore: RbagEventStoreInstance, id: string) => findOneProjection(
  eventStore,
  getUserStreamSubjectById(id),
  {
    projectionName: UserProjectionName
  }
)
