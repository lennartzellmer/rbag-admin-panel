import { assign, createMachine } from 'xstate'
import type { AxiosResponse } from 'axios'
import type { Response } from '../../types/base.types'
import type { MachineContext, MachineEvents, MachineServices } from './genericFetchData.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createGenericFetchDataMachine<T extends (...args: any[]) => Promise<AxiosResponse<Response<any>>>>(fetchDataFunction: T) {
  type FetchedDataType = Awaited<ReturnType<T>>['data']['data']
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QwHZgE4EsDGAxMALtgBYAiAhgeQHQboD26AxAEoCiAKiwJoDaADAF1EoAA71YmApnooRIAB6IArMoCc1AOwAWAEy6AjGoMHNADl0A2MwBoQAT0T7tW-gGZd-S5YNW133QBfQLtUDBx8IjJKGgAzQhJMFCgmCFkwaiSAN3oAawz4qIBaCBiBYSQQcUlpWXklBDc3TWp+XTc9ZUs3M203I2U7RwQzNy1lfi8LS01NVQM3YNCwNCw8BOiqakLE5NT0zJQc-O2NkrKDCrEJKRk5SoamlraO3S6evoGhxAWDajfJpZ+Jo1P4JsozEsQGE1pESBQtjtiEkUnRGNRRAAbSixRgAW1OxVKVHK8mqtzqD0QT1a7U63V6-TUgwcTjm-3c+nBJm8wRCIBQ9AgcHkMIiGwR5DJN1q91ADSKlm+CEVrUm6o16oM2ihYvWUUltHQDHQ0pqd3qiBmfz0RgM-G0CzcDOVVn4-269r0am0QOUml1K3C+vhMUJuygZopcsUiD0ru0z10agsCzMPuB-sDq3FBrDSMgADl6JKo7LLQhrdRbcYHU6XayRn8JpNdJpgW5Qdp3Nng3DNnENpBJQBBLLkTDYgBGmLAZYtVMrmhthlrjqaDeGBmUfzUmm83ncHbMbT5gSAA */
      id: 'genericFetchData',
      initial: 'fetching',
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./genericFetchData.machine.typegen').Typegen0,
      schema: {
        context: {} as MachineContext<FetchedDataType>,
        events: {} as MachineEvents,
        services: {} as MachineServices<FetchedDataType>
      },
      context: {},
      states: {
        error: {
          id: 'idle',
          on: {
            RETRY: {
              target: 'fetching'
            }
          },
          exit: 'clearErrorMessageFromContext'
        },
        fetching: {
          invoke: {
            id: 'fetch-data',
            src: 'fetchData',
            onDone: [
              {
                target: 'fetchedNoData',
                cond: 'isNoDataAvailable'
              },
              {
                actions: 'assignDataToContext',
                target: 'fetchedDataAvailable'
              }
            ],
            onError: {
              actions: 'assignErrorToContext',
              target: 'error'
            }
          }
        },
        fetchedNoData: {
          type: 'final',
          data: (context) => { return { ...context } }
        },
        fetchedDataAvailable: {
          type: 'final',
          data: (context) => { return { ...context } }
        }
      }
    },
    {
      actions: {
        assignErrorToContext: assign({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errorMessage: (_, event: any) => event.data?.message.toString() || 'Could not fetch data'
        }),
        clearErrorMessageFromContext: assign({
          errorMessage: undefined
        }),
        assignDataToContext: assign({
          data: (_, event) => {
            return event.data
          }
        })
      },
      services: {
        fetchData: () => async () => {
          const response = await fetchDataFunction()
          return response.data.data
        }
      },
      guards: {
        isNoDataAvailable: (context, event) => {
          if (event.data === undefined || event.data === null)
            return true

          else if (Array.isArray(event.data) && event.data.length === 0)
            return true

          else
            return false
        }
      }
    }
  )
}
