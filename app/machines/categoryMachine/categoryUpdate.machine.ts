import { assertEvent, fromPromise, setup } from 'xstate'
import type { VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import { updateVeranstaltungsKategorie } from '~/service/veranstaltung-kategorie'
import { showToast } from '../actions/toast'

export type MachineEvents
  = | { type: 'SAVE', category: VeranstaltungsKategorieSchema }
    | { type: 'CLOSE' }

export const categoryUpdateMachine = setup({
  types: {
    events: {} as MachineEvents
  },
  actors: {
    updateCategoryActor: fromPromise(async ({ input }: { input: { category: VeranstaltungsKategorieSchema } }) => {
      return await updateVeranstaltungsKategorie({ id: input.category.id, category: input.category })
    })
  },
  actions: {
    showToast
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFcAOECGAXMBhbYUA9gE4CeAshgMYAWAlgHZgB09EANmAMS4AyAeQDKAUQDaABgC6iUKiKx6WekUayQAD0QBGAJwBWFgBYATCaPaAzBP2WjRgGz6AHABoQZRJYfbj5lxIOAOx2Js4mAL4R7miYOPg4xORUdEys7FzcQgCCAGri0uryisqq6loIJhISLA4GzvoOlrrORi5N7p6VJkEsEtr6QSZODhJBbU1RMegECYSklDQMzCyx2ExQc0lk3BCq6YwAbkQA1qxr8QTbKcvnM8qMm1cLCEzH1OuqklLfRQpKKjUSE0iCcNV0QUCYIcoyCA06iCqhiCum0QWc2mcGJMjSmIAueGeySWaVW9w2WwW3DAJBIpBYqA42AAZqQALZkuKExILG6ki4UolkV5HIgfUqMb6-YHFAFlYEVbRVFjOOwDfS6MwSVUOBEIVosVFw+xGXQSKp1KLRECMIgQODqAmU4mpZh-EqA8qIAC0DhY2h8pkGuiMzWsEL13pMxhsQWCVW0mOsGKCeKdQr5KwyYHdcqBoAqFhVlga4yRozqerMfocOrNtksJjRllT1vTPJdtxYezdMv+Eq9CHqLEGPhM3jNJl0EY8iJxxgno8s2lDmOcafu3Pmnf55Mezq6cn7noVXicLBCznRGKMEiMcIaVYklhYw2c0-NpvNVksVoiQA */
  id: 'categoryUpdateMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLOSE: {
          target: 'done'
        },
        SAVE: {
          target: 'updatingCategory',
          reenter: true
        }
      }
    },
    done: {
      type: 'final'
    },
    updatingCategory: {
      invoke: {
        src: 'updateCategoryActor',
        input: ({ event }) => {
          assertEvent(event, 'SAVE')
          return { category: event.category }
        },
        onDone: {
          target: 'done',
          actions: {
            type: 'showToast',
            params: () => ({
              title: 'Kategorie aktualisiert',
              description: 'Die Veranstaltungskategorie wurde erfolgreich aktualisiert.',
              color: 'success',
              icon: 'i-lucide-check-circle'
            })
          }
        },
        onError: {
          target: 'idle',
          actions: {
            type: 'showToast',
            params: () => ({
              title: 'Fehler beim Aktualisieren',
              description: 'Die Veranstaltungskategorie konnte nicht aktualisiert werden. Bitte versuche es erneut.',
              color: 'error',
              icon: 'i-lucide-alert-circle'
            })
          },
          reenter: true
        }
      }
    }
  }
})
