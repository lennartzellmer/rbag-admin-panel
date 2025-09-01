/* eslint-disable @typescript-eslint/no-explicit-any */
import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject, createSubject } from 'vorfall'
import type { DomainEvent, EventStoreInstance } from 'vorfall'
import type { CreateRbagVeranstaltungSchema, RbagEvent } from '~~/validation/veranstaltungSchema'

export const RbagVeranstaltungSubject = createSubject('RbagVeranstaltung')

export const getRbagVeranstaltungStreamSubjectById = (id: string) => createStreamSubject(`${RbagVeranstaltungSubject}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type RbagVeranstaltungEventMetadata = {
  changedBy: string
}

export type RbagVeranstaltungCreated = DomainEvent<
  'RbagVeranstaltungCreated',
  CreateRbagVeranstaltungSchema,
  RbagVeranstaltungEventMetadata
>

export type RbagVeranstaltungEvent =
  | RbagVeranstaltungCreated

export const initialState = (): RbagEvent => {
  return {
    details: {
      name: '',
      categoryId: '',
      startDate: new Date(),
      endDate: new Date(),
      zielgruppe: ''
    },
    isPublished: false,
    isCanceled: false
  }
}

// =============================================================================
// Evolve
// =============================================================================

export const evolve = (
  state: RbagEvent,
  event: RbagVeranstaltungEvent
): RbagEvent => {
  const { type, data } = event

  switch (type) {
    case 'RbagVeranstaltungCreated': {
      return data
    }
    default: {
      // Exhaustive matching of the event type
      // This will throw a TS error if a new event type is added and not handled here
      const _exhaustiveCheck: never = type as never
      return state
    }
  }
}

// =============================================================================
// Projections
// =============================================================================

export const RbagVeranstaltungProjectionName = 'RbagVeranstaltung' as const

export const rbagVeranstaltungProjectionDefinition = createProjectionDefinition({
  name: RbagVeranstaltungProjectionName,
  evolve: evolve,
  canHandle: ['RbagVeranstaltungCreated'],
  initialState: initialState
})

export const getRbagVeranstaltungenPaginated = (eventStore: EventStoreInstance<any>, skip: number, limit: number) => findMultipleProjections(
  eventStore,
  RbagVeranstaltungSubject,
  {
    projectionName: RbagVeranstaltungProjectionName
  },
  {
    skip,
    limit
  })

export const getRbagVeranstaltungCount = (eventStore: EventStoreInstance<any>) => countProjections(
  eventStore,
  RbagVeranstaltungSubject,
  {
    projectionName: RbagVeranstaltungProjectionName
  }
)

export const getRbagVeranstaltungById = (eventStore: EventStoreInstance<any>, id: string) => findOneProjection(
  eventStore,
  getRbagVeranstaltungStreamSubjectById(id),
  {
    projectionName: RbagVeranstaltungProjectionName
  })

export const RbagVeranstaltungProjection = createProjectionDefinition({
  name: RbagVeranstaltungProjectionName,
  canHandle: [
    'RbagVeranstaltungCreated'
  ],
  evolve,
  initialState
})
