import { assign, fromPromise, setup } from 'xstate'
import { patchEvent } from '~/services/events'
import type { EventSchema } from '~~/validation/eventSchema'
import { toast, ToastAction } from '@/components/ui/toast'
import type { Toast } from '@/components/ui/toast/use-toast'

type MachineContext = {
  data: Partial<EventSchema> | null
}

type MachineEvents = {
  type: 'user.edit'
  payload: { event: EventSchema }
} | {
  type: 'user.save'
}

export const autoSaveEventMachine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as MachineEvents
  },
  actions: {
    assignData: assign({
      data: (_, params: EventSchema) => params
    }),
    showToast: (_, params: { toast: Toast }) => {
      toast({
        ...params.toast
      })
    },
    showErrorToast: ({ self }) => {
      toast({
        title: 'Fehler beim Speichern',
        action: h(ToastAction, {
          altText: 'Try again',
          onClick: () => {
            self.send({ type: 'user.save' })
          }
        }, {
          default: () => 'Nochmal versuchen'
        })
      })
    }
  },
  actors: {
    saveData: fromPromise(async ({ input, signal }: { input: { id: string, data: Partial<EventSchema> }, signal: AbortSignal }) => {
      const data = await patchEvent(input.id, input.data, signal)
      return data
    })
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXA9gZWQNzAFlkBjACwEsA7MAYlVjACcA6SC9AbQAYBdRUAAdMsDhUxUBIAB6IAtAFYFLABwB2NQE4F3AGwAmAwEZ9AZn0KANCACe8o9zUt9m7tyM793FQoAsClQBfQOs0LFwCYnJqMBYIMAAjTFQqEmooWmlYdGR0WOQAMzymAAodbgBKWjCcfCJSSho4xOTU9J5+JBBhUXRxSS7ZBF9TUxZvExUTFxUVd2s7BDmWXU1fdYVdFXNuX24FYNCMWsiGmJZYfHTaCAlY6jxMAGtYy4IAEVzkDqkesQkpEM1voWL41N5fEY1EYjLpuIYFoglKCwfC1moXLp1mpDiAahF6tEmm9rswmJhWIIADa5AoUgC2FzqnxyPy6fz6AMGiGBoPBKkh0Nh8N0iIQTmxaLBmOxpgOITxxwJUUadAYzCZBDZQhE-wGoCGRjWKPcplmGLUCk0ots8gFLE2fhFpl8mgs+2CCqomHi8C6+LqKpiv11nP1MnsuxYLvcKgMMzMvjFcgsRlUrgUMJh+hGai2uIDpyJ9wgVLAId6-UBiDlYzMFjBmlMGKNydhvgdujzOwFFl0RlMBaVgbOTXiSRSaSoUAreurCEUumjeyMcf0CZdYrUKlU-bUvn0A5UmmPmiH4RHxc16VnYfnAWUUMMq2h-nMpjFyMlLml1uxnsCIA */
  id: 'autoSaveMachine',
  initial: 'idle',
  context: {
    data: null
  },
  states: {
    idle: {},
    debouncing: {
      after: {
        500: 'saving'
      }
    },
    saving: {
      invoke: {
        id: 'saveData',
        src: 'saveData',
        input: ({ context }) => ({ data: context.data!, id: context.data!.id! }),
        onError: {
          target: 'idle',
          actions: [{
            type: 'showErrorToast'
          }]
        },
        onDone: {
          target: 'idle',
          actions: [
            {
              type: 'showToast',
              params: {
                toast: {
                  title: 'Veranstaltung gespeichert'
                }
              }
            },
            {
              type: 'assignData',
              params: ({ event }) => event.output
            }
          ]
        }
      }
    }
  },
  on: {
    'user.edit': {
      target: '.debouncing',
      actions: [
        {
          type: 'assignData',
          params: ({ event }) => event.payload.event
        }
      ]
    },
    'user.save': '.saving'
  }
})
