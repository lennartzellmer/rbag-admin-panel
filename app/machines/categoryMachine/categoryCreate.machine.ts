import { assertEvent, fromPromise, setup } from 'xstate'
import type { VeranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import { createVeranstaltungsKategorie } from '~/service/veranstaltung-kategorie'
import { showToast } from '../actions/toast'

export type MachineEvents
  = | { type: 'SAVE', category: VeranstaltungsKategorieCreateSchema }
    | { type: 'CLOSE' }

export const categoryCreateMachine = setup({
  types: {
    events: {} as MachineEvents
  },
  actors: {
    createCategoryActor: fromPromise(async ({ input }: { input: { category: VeranstaltungsKategorieCreateSchema } }) => {
      return await createVeranstaltungsKategorie({ category: input.category })
    })
  },
  actions: {
    showToast
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAXMUD2AnAngMK5gZgCyqyAFgJYB2YAdLRADZgDEhAMgPIBlAKIBtAAwBdRKAAO2WLXS1s9aSAAeiAIwAWMUwBsAVgAcJo1otidAJgCcAZgA0IfIhsGtTMXZvnjxgDsRjY2AL5hLmiYOATEpJiUNAzMrBycAgCCAGqikmpyCkoqapoIWnaBTCZ2lTqBYo0OFgYubuVaXjoVNkZ2YiYGDvYODhFRZLFEJGRJdIxMyDNK9FCEk3j4nBAqqfQAbtgA1szRWJvxs1Tzp8sMaxsECAyH0cr04hKfBfKK76WIYw2JiBAwGMTNLSgozNVquRD9JgVGHWYaBHQmQKdcYgM5TS6Ja4pRZ3VbrGKbThgXC4PBMGRsDAAMzwAFtFo9pgkKESFksEvdyecni9sG8VJ9vkgQIU-iVpWUtA59AY9Kr+g4MeidG1EABaKq9QKBGwOcHmaxDHQRSIgejYCBwNR4i7LHnJRg-Ir-BX6uHtPV2HRMUxiIYaowGEya8K2l1xN1zYlpMBeuWqX0IWy6jpeAYmnQOXxiXRg2MTCkJ7lJhY7T3S2XFDOgMp2LTAoyRnSd1VaMTokw5vt2ap6HSq5rdzyhHHxrlXD23AVkzlppsAhAOUGGbpmTsmHTjhxaHN2IxIwaqsMDfdDG1hIA */
  id: 'categoryCreateMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLOSE: {
          target: 'done'
        },
        SAVE: {
          target: 'creatingCategory',
          reenter: true
        }
      }
    },
    done: {
      type: 'final'
    },
    creatingCategory: {
      invoke: {
        src: 'createCategoryActor',
        input: ({ event }) => {
          assertEvent(event, 'SAVE')
          return { category: event.category }
        },
        onDone: {
          target: 'done',
          actions: {
            type: 'showToast',
            params: () => ({
              title: 'Kategorie erstellt',
              description: 'Die Veranstaltungskategorie wurde erfolgreich erstellt.',
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
              title: 'Fehler beim Erstellen',
              description: 'Die Veranstaltungskategorie konnte nicht erstellt werden. Bitte versuche es erneut.',
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
