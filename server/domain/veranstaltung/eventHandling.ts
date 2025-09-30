import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject } from 'vorfall'
import type { DomainEvent, Subject } from 'vorfall'
import type { RbagEventStoreInstance } from '~~/server/plugins/eventStore'
import type { CreateVeranstaltungSchema, Veranstaltung } from '~~/shared/validation/veranstaltungSchema'

export const VeranstaltungEntity = 'RbagVeranstaltung'
export type VeranstaltungSubject = Subject<`${typeof VeranstaltungEntity}`>
export const getVeranstaltungStreamSubjectById = (id: string) => createStreamSubject(`${VeranstaltungEntity}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type VeranstaltungEventMetadata = {
  changedBy: string
}

export type VeranstaltungErstellt = DomainEvent<
  'VeranstaltungErstellt',
  CreateVeranstaltungSchema,
  VeranstaltungEventMetadata,
  VeranstaltungSubject
>

export type VeranstaltungEvents =
  | VeranstaltungErstellt

// =============================================================================
// Evolve
// =============================================================================

export const initialState = (): Veranstaltung => {
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

export const evolve = (
  state: Veranstaltung,
  event: VeranstaltungEvents
): Veranstaltung => {
  const { type, data } = event

  switch (type) {
    case 'VeranstaltungErstellt': {
      return data
    }
    default: {
      // Exhaustive matching of the event type - This will throw a TS error if a new event type is added and not handled here
      const _exhaustiveCheck: never = type as never
      return state
    }
  }
}

// =============================================================================
// Projections
// =============================================================================

export const VeranstaltungProjectionName = 'Veranstaltung' as const

export const veranstaltungProjectionDefinition = createProjectionDefinition({
  name: VeranstaltungProjectionName,
  evolve: evolve,
  canHandle: ['VeranstaltungErstellt'],
  initialState: initialState
})

export const getVeranstaltungenPaginated = (eventStore: RbagEventStoreInstance, skip: number, limit: number) => findMultipleProjections(
  eventStore,
  VeranstaltungEntity,
  {
    projectionName: VeranstaltungProjectionName
  },
  {
    skip,
    limit
  })

export const getVeranstaltungCount = (eventStore: RbagEventStoreInstance) => countProjections(
  eventStore,
  VeranstaltungEntity,
  {
    projectionName: VeranstaltungProjectionName
  }
)

export const getVeranstaltungById = (eventStore: RbagEventStoreInstance, id: string) => findOneProjection(
  eventStore,
  getVeranstaltungStreamSubjectById(id),
  {
    projectionName: VeranstaltungProjectionName
  })
