/* eslint-disable @typescript-eslint/no-explicit-any */
import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject, createSubject } from 'vorfall'
import type { DomainEvent, EventStoreInstance } from 'vorfall'
import type { CreateRbagVeranstaltungKategorieSchema, KategorieSchema, UpdateRbagVeranstaltungKategorieSchema } from '~~/validation/veranstaltungKategorieSchema'

export const RbagVeranstaltungKategorieSubject = createSubject('RbagVeranstaltungKategorie')

export const getRbagVeranstaltungsStreamSubjectById = (id: string) => createStreamSubject(`${RbagVeranstaltungKategorieSubject}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type RbagVeranstaltungEventMetadata = {
  changedBy: string
}

export type RbagVeranstaltungKategorieCreated = DomainEvent<
  'RbagVeranstaltungKategorieCreated',
  CreateRbagVeranstaltungKategorieSchema,
  RbagVeranstaltungEventMetadata
>

export type RbagVeranstaltungKategorieUpdated = DomainEvent<
  'RbagVeranstaltungKategorieUpdated',
  UpdateRbagVeranstaltungKategorieSchema,
  RbagVeranstaltungEventMetadata
>

export type RbagVeranstaltungKategorieEvent =
  | RbagVeranstaltungKategorieCreated
  | RbagVeranstaltungKategorieUpdated

export const initialState = (): KategorieSchema => {
  return {
    name: '',
    description: ''
  }
}

// =============================================================================
// Evolve
// =============================================================================

export const evolve = (
  state: KategorieSchema,
  event: RbagVeranstaltungKategorieEvent
): KategorieSchema => {
  const { type, data } = event

  switch (type) {
    case 'RbagVeranstaltungKategorieCreated': {
      return data
    }
    case 'RbagVeranstaltungKategorieUpdated': {
      return {
        ...state,
        ...data
      }
    }
    default: {
      // Exhaustive matching of the event type
      // This will throw a TS error if a new event type is added and not handled here
      const _: never = event
      return state
    }
  }
}

// =============================================================================
// Projections
// =============================================================================

export const RbagVeranstaltungKategorieProjectionName = 'RbagVeranstaltungKategorie' as const

export const rbagVeranstaltungKategorieProjectionDefinition = createProjectionDefinition({
  name: RbagVeranstaltungKategorieProjectionName,
  evolve: evolve,
  canHandle: ['RbagVeranstaltungKategorieCreated', 'RbagVeranstaltungKategorieUpdated'],
  initialState: initialState
})

export const getRbagVeranstaltungsKategorienPaginated = (eventStore: EventStoreInstance<any>, skip: number, limit: number) => findMultipleProjections(
  eventStore,
  RbagVeranstaltungKategorieSubject,
  {
    projectionName: RbagVeranstaltungKategorieProjectionName
  },
  {
    skip,
    limit
  })

export const getRbagVeranstaltungKategorieCount = (eventStore: EventStoreInstance<any>) => countProjections(
  eventStore,
  RbagVeranstaltungKategorieSubject,
  {
    projectionName: RbagVeranstaltungKategorieProjectionName
  }
)

export const getRbagVeranstaltungKategorieById = (eventStore: EventStoreInstance<any>, id: string) => findOneProjection(
  eventStore,
  getRbagVeranstaltungsStreamSubjectById(id),
  {
    projectionName: RbagVeranstaltungKategorieProjectionName
  })

export const RbagVeranstaltungKategorieProjection = createProjectionDefinition({
  name: RbagVeranstaltungKategorieProjectionName,
  canHandle: [
    'RbagVeranstaltungKategorieCreated',
    'RbagVeranstaltungKategorieUpdated'
  ],
  evolve,
  initialState
})
