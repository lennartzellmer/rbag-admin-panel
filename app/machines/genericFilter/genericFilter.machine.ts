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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgGUBRAFQH0AxASQBkqKAlGgEQoCEB5AKoA5AMIVOAbQAMAXUSgADgHtYuAC64l+eSAAeiACwAmADQgAnogDMVgBwA6I1KsBGOwFYpR9wYDs7gF8AszQsPEJSSlpGFnZpOSQQZVUNLR19BGMzSwQXH3tPKSKANncATl8DKTL3XyCQjBwCYnsAd3R1Aig6JQAnAEF8JTVsMF6KADcwfDUSET4hRjYAWXidZM60xIyfF3tfZxcjI1KnWyti7OtjArLii5qDKykXFyli+pBQpoi2jo18N0+oNhqNxlMZiRdLA1Og1GB7OgAGbw3rIWxFUjfcItdqdQE9AZDEZjSbTNRrRIbVLabaIXb7Q7HU5Sc6XCzWMpWezVe7FMrOIy+WwGHxBYIgIYQOA6bHNIjrFSbWmgDIAWnZOQ1nzlv1wEAANmBFSlNCq9Ihir5fPZbO48nb3FafD4rggrE8eXcHj5nq93jrGjiiH98UCiaDSRC1CblelEEYBfYDKKrEZbCKU0YXJrrN57C5fBUXgL7bZ7uKAkA */
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
