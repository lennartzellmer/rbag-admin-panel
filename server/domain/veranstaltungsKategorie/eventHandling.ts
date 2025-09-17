/* eslint-disable @typescript-eslint/no-explicit-any */
import { countProjections, createProjectionDefinition, findMultipleProjections, findOneProjection, createStreamSubject } from 'vorfall'
import type { DomainEvent, EventStoreInstance, Subject } from 'vorfall'
import type { AktualisiereVeranstaltungKategorieSchema, AktualisiereVoreinstellungenSchema, ErstelleVeranstaltungKategorieSchema } from './validation'
import type { VeranstaltungsKategorieSchema } from '~~/validation/veranstaltungKategorieSchema'
import type { RbagEventStoreInstance } from '~~/server/plugins/eventStore'

export const VeranstaltungKategorieEntity = 'VeranstaltungKategorie'

export type VeranstaltungKategorieSubject = Subject<`${typeof VeranstaltungKategorieEntity}`>

export const getVeranstaltungsKategorieStreamSubjectById = (id: string) => createStreamSubject(`${VeranstaltungKategorieEntity}/${id}`)

// =============================================================================
// Events
// =============================================================================

export type VeranstaltungEventMetadata = {
  requestedBy: string
}

export type VeranstaltungsKategorieErstellt = DomainEvent<
  'VeranstaltungsKategorie.Erstellt',
  ErstelleVeranstaltungKategorieSchema,
  VeranstaltungEventMetadata,
  VeranstaltungKategorieSubject
>

export type VeranstaltungsKategorieAktualisiert = DomainEvent<
  'VeranstaltungsKategorie.Aktualisiert',
  AktualisiereVeranstaltungKategorieSchema,
  VeranstaltungEventMetadata,
  VeranstaltungKategorieSubject
>

export type KategorieVoreinstellungenAktualisiert = DomainEvent<
  'VeranstaltungsKategorie.Voreinstellungen.Aktualisiert',
  AktualisiereVoreinstellungenSchema,
  VeranstaltungEventMetadata,
  VeranstaltungKategorieSubject
>

export type VeranstaltungKategorieEvent =
  | VeranstaltungsKategorieErstellt
  | VeranstaltungsKategorieAktualisiert
  | KategorieVoreinstellungenAktualisiert

export const initialState = () => null

// =============================================================================
// Evolve
// =============================================================================

export const evolve = (
  state: VeranstaltungsKategorieSchema,
  event: VeranstaltungKategorieEvent
): VeranstaltungsKategorieSchema => {
  const { type, data } = event

  switch (type) {
    case 'VeranstaltungsKategorie.Erstellt': {
      return data
    }
    case 'VeranstaltungsKategorie.Aktualisiert': {
      return {
        ...state,
        ...data
      }
    }
    case 'VeranstaltungsKategorie.Voreinstellungen.Aktualisiert': {
      return {
        ...state,
        voreinstellungen: data
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

export const veranstaltungKategorieProjectionName = 'VeranstaltungKategorie' as const

export const veranstaltungKategorieProjectionDefinition = createProjectionDefinition({
  name: veranstaltungKategorieProjectionName,
  evolve: evolve,
  canHandle: [
    'VeranstaltungsKategorie.Erstellt',
    'VeranstaltungsKategorie.Aktualisiert',
    'VeranstaltungsKategorie.Voreinstellungen.Aktualisiert'
  ],
  initialState: initialState
})

export const getVeranstaltungsKategorienPaginated = (eventStore: EventStoreInstance<any>, skip: number, limit: number) => findMultipleProjections(
  eventStore,
  VeranstaltungKategorieEntity,
  {
    projectionName: veranstaltungKategorieProjectionName
  },
  {
    skip,
    limit
  })

export const getVeranstaltungKategorieCount = (eventStore: RbagEventStoreInstance) => countProjections(
  eventStore,
  VeranstaltungKategorieEntity,
  {
    projectionName: veranstaltungKategorieProjectionName
  }
)

export const getVeranstaltungKategorieById = (eventStore: RbagEventStoreInstance, id: string) => findOneProjection(
  eventStore,
  getVeranstaltungsKategorieStreamSubjectById(id),
  {
    projectionName: veranstaltungKategorieProjectionName
  })
