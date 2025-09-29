import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject } from 'vorfall'
import type { DomainEvent, Subject } from 'vorfall'
import type { MediaMetadata } from './validation'
import type { RbagEventStoreInstance } from '~~/server/plugins/eventStore'

export const MediaEntity = 'Media'

export type MediaSubject = Subject<`${typeof MediaEntity}`>

export const getMediaStreamSubjectById = (id: string) => createStreamSubject(`${MediaEntity}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type MediaEventMetadata = {
  requestedBy: string
}

export type MediaCreated = DomainEvent<
  'MediaCreated',
  MediaMetadata,
  MediaEventMetadata,
  MediaSubject
>

export type MediaEvents = MediaCreated

// =============================================================================
// Evolve
// =============================================================================

export const initialState = () => null

export const evolve = (state: MediaMetadata, event: MediaEvents): MediaMetadata => {
  const { type, data } = event

  switch (type) {
    case 'MediaCreated': {
      return {
        ...state,
        ...data
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

export const MediaProjectionName = 'Media' as const

export const mediaProjectionDefinition = createProjectionDefinition({
  name: MediaProjectionName,
  evolve,
  canHandle: ['MediaCreated'],
  initialState
})

export const getMediasPaginated = (
  eventStore: RbagEventStoreInstance,
  skip: number,
  limit: number
) => findMultipleProjections(
  eventStore,
  MediaEntity,
  {
    projectionName: MediaProjectionName
  },
  {
    skip,
    limit
  }
)

export const getMediaCount = (eventStore: RbagEventStoreInstance) => countProjections(
  eventStore,
  MediaEntity,
  {
    projectionName: MediaProjectionName
  }
)

export const getMediaByKey = (eventStore: RbagEventStoreInstance, id: string) => findOneProjection(
  eventStore,
  MediaEntity as MediaSubject,
  {
    projectionName: MediaProjectionName,
    projectionQuery: { key: id }
  }
)
