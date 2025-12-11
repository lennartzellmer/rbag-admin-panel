import { assertEvent, fromPromise, setup } from 'xstate'
import type { CollectionResponseList, PaginatedRequestParams } from '../../types/base.types'
import type { VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import { updateVeranstaltungsKategorie } from '~/service/veranstaltung-kategorie'
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export type FetchDataFunction<T> = ({ paginationParams }: { paginationParams: PaginatedRequestParams }) => Promise<CollectionResponseList<T>>

export type MachineEvents
  = | { type: 'SAVE', category: VeranstaltungsKategorieSchema }
    | { type: 'CLOSE' }

export function createEditCategoryMachine() {
  return setup({
    types: {
      events: {} as MachineEvents
    },
    actors: {
      updateCategoryActor: fromPromise(async ({ input }: { input: { category: VeranstaltungsKategorieSchema } }) => {
        return await updateVeranstaltungsKategorie({ id: input.category.id, category: input.category })
      })
    },
    actions: {
      showToast: (_, params: { title: string, description: string, color: Toast['color'], icon: string }) => {
        const toast = useToast()
        toast.add({
          title: params.title,
          description: params.description,
          icon: params.icon,
          color: params.color
        })
      }
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcDCBDNYoHsAnATwFksBjACxQDswA6FCAGzAGIBlAQQDUBRANoAGALqJQAB3yx0KfLQkgAHogAcAVgBsDAJwBmfQEYtAJlMB2NcMsaANCGKJTanRrUXhAFiOn9W4S0jLwBfEIdUTBw8IjJKGnomVg4MABkAeU4hMSVpWTR5RSQVRCMNfQZDUy1XYV0NXS8bBycEfV01Bi0vC31hDUtPHw0wiIh0bFwCEnJqOkYAV0kIHDooSZiSdggFRjoAN3wAa0ZIjem4ucSllYLadeiLhAP8ClWFEVFP3Jk5BSVVAgjDZTJUvKYmhpAtpDPoWs4vF4uhZdLoIVZfBoUaFwuBxlEprFZglFstVvdzrF2GBCIQiAxJCwcAAzIgAWwYZ0eRPi8wYN3JD0JJGetEObwKHzE32KeT+RVAgL8FV0Rl6+msRjUwMCanhCF0FgYGi8Bg11S8+mqui0YVxtHwEDgSi5wsuJJ++UKAMQAFotPqjY0NL5VSjyuYbKM8RNuTNeYlmGxPfKfQhwfqjI09C5hMFEVoqlZo67Nu6+Tt6CnJQqSgg1D49F5tBptKYGgNdPr2kajIYAuVTfpekYS-jKfGrqTbmsJ60pL8a2mLL0GGr2lCLNUTQZ9fU11b-K2PAFhP47SEgA */
    id: 'editCategoryMachine',
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
          },
          src: 'updateCategoryActor'
        }
      }
    }
  })
}
