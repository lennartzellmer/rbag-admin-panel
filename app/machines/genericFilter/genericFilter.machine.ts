import { assign, setup, sendParent, assertEvent } from 'xstate'
import type { GetterReturnType, InboundMachineEvents, MachineContext, OutboundMachineEvents } from './genericFilter.types'

export function createFilterMachine<TUrlKey extends string, TGetterReturnType extends GetterReturnType>(
  params: {
    // The key under which the filter is stored in the browsers URL
    filterUrlKey: TUrlKey
    // The name of the parameter for the backend
    filterParamsKeys: Array<keyof NonNullable<TGetterReturnType>>
    // A function that gets the value from the URL
    filterValueGetter: (URLKey: TUrlKey) => TGetterReturnType
  }
) {
  return setup({
    types: {
      context: {} as MachineContext<TGetterReturnType, TUrlKey>,
      events: {} as InboundMachineEvents<TGetterReturnType>
    },
    actions: {
      assignInitialStateFromURLParam: assign({
        filterValue: ({ context }) => params.filterValueGetter(context.URLKey)
      }),

      assignFilterValue: assign({
        filterValue: ({ event }) => {
          assertEvent(event, ['SET_FILTER', 'SET_FILTER_DEBOUNCED'])
          return event.payload ? event.payload : null
        }
      }),

      informParentMachine: sendParent(({ context }) => {
        if (context.filterValue) {
          return {
            type: 'FILTER_UPDATED',
            filter: context.filterValue
          } satisfies OutboundMachineEvents<TGetterReturnType>
        }
        else {
          return {
            type: 'FILTER_RESET',
            filterParamsKeys: context.filterParamsKeys
          } satisfies OutboundMachineEvents<TGetterReturnType>
        }
      }),

      setOrDeleteURLParam: ({ context }) => {
        const url = new URL(window.location.href)
        const filterValue = context.filterValue?.[context.URLKey]

        if (filterValue)
          url.searchParams.set(context.URLKey, filterValue)
        else
          url.searchParams.delete(context.URLKey)

        window.history.replaceState(history.state, '', url)
      }
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgGUBRAFQH0AxASQBkqKAlGgEQoCEB5AKoA5AMIVOAbQAMAXUSgADgHtYuAC64l+eSAAeiAIwA2AHQB2AKxGATAA4jZ2-YDMBg84A0IAJ6GpBk2sAFgs7KSCjCwBOMzdrAF94rzQsPEJSSlpGFnZpOSQQZVUNLR19BCigqJNbA3sg6ws652szL18EAytA2ykzBv9G516gxOSMHAJiEwB3dHUCKDolACcAQXwlNWwwFYoANzB8NRIRPiFGNgBZPJ0ihdKC8strE2cbUKNI966jdsRrMETEEpEYpFYzEYoo1PmMQClJulZvMNPglqsNlsdntDscSLpYGp0GowCZ0AAzEkrZC9KSkBFpaZzBZo5brTbbXYHI5qW4Fe4lbRPRDRZyBKFRZxSKIGGVBWxBf4IZySkzSozDJq2RwRCyJJIgTYQOA6BlTIh3FQPIWgcoAWlcgSCzliLTc7ycbR8iDt0UCFiCsSktii4NDsrhZqRuAgABswJbipobXpEAqLMCutK7KEnE4lc4ggEDEWA41A9YVZGJoyiMiWej2Viubi1InrWUAaHgSFXGZg7Zhk5PN7lY0TAYzFEoVCLIX+859fEgA */
    id: `filterMachine_${params.filterUrlKey}`,
    initial: 'idle',
    context: {
      URLKey: params.filterUrlKey,
      filterParamsKeys: params.filterParamsKeys,
      filterValue: null
    },
    entry: [
      'assignInitialStateFromURLParam',
      'informParentMachine'
    ],
    states: {
      idle: {},
      waitingForAnotherEvent: {
        exit: [
          'setOrDeleteURLParam',
          'informParentMachine'
        ],
        after: {
          800: 'idle'
        },

        on: {
          CONFIRM: 'idle'
        }
      }
    },
    on: {
      SET_FILTER_DEBOUNCED: {
        target: '.waitingForAnotherEvent',
        actions: 'assignFilterValue'
      },
      SET_FILTER: {
        target: '.idle',
        actions: [
          'assignFilterValue',
          'setOrDeleteURLParam',
          'informParentMachine'
        ]
      }
    }
  })
}
