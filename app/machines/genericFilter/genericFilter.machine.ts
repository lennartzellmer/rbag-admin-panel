import { assign, setup, sendParent, assertEvent } from 'xstate'
import type { FilterConfig, InboundMachineEvents, MachineContext, OutboundMachineEvents } from './genericFilter.types'

export function createFilterMachine<TUrlKey extends string, TFilterConfig extends FilterConfig<string>>(
  params: {
    // The key under which the filter is stored in the browsers URL
    filterUrlKey: TUrlKey
    // The name of the parameter for the backend
    filterParamsKey: TFilterConfig['filterParamsKey']
    // A function that gets the value from the URL
    filterValueGetter: (URLKey: TUrlKey) => TFilterConfig | null
  }
) {
  return {
    config: params,
    machine: setup({
      types: {
        context: {} as MachineContext<TFilterConfig, TUrlKey>,
        events: {} as InboundMachineEvents<TFilterConfig>
      },
      actions: {
        assignInitialStateFromURLParam: assign({
          filterState: ({ context }) => params.filterValueGetter(context.URLKey)
        }),

        assignFilterValue: assign({
          filterState: ({ event }) => {
            assertEvent(event, ['SET_FILTER', 'SET_FILTER_DEBOUNCED'])
            return event.payload ? event.payload : null
          }
        }),

        informParentMachine: sendParent(({ context }) => {
          if (context.filterState) {
            return {
              type: 'FILTER_UPDATED',
              filter: context.filterState
            } satisfies OutboundMachineEvents<TFilterConfig>
          }
          else {
            return {
              type: 'FILTER_RESET',
              filterParamsKey: context.filterParamsKey
            } satisfies OutboundMachineEvents<TFilterConfig>
          }
        }),

        setOrDeleteURLParam: ({ context }) => {
          const url = new URL(window.location.href)
          const filterValue = context.filterState?.filterValue

          if (filterValue)
            url.searchParams.set(context.URLKey, filterValue.toString())
          else
            url.searchParams.delete(context.URLKey)

          window.history.replaceState(history.state, '', url)
        }
      }
    }).createMachine({
      /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgGUBRAFQH0AxASQBkqKAlGgEQoCEB5AKoA5AMIVOAbQAMAXUSgADgHtYuAC64l+eSAAeiACwAmADQgAnogDMVgBwA6I1KsBGOwFYpR9wYDs7gF8AszQsPEJSSlpGFnZpOSQQZVUNLR19BAA2F19HIyNM2ycDTPdMqXczSwQjBxcpPwKpWxcjAE53K0KgkIwcAmJ7AHd0dQIoOiUAJwBBfCU1bDApigA3MHw1EhE+IUY2AFl4nWSxtMSMnyt7Fza2l0LM2qs23wMqxCM-ezaDH19bAZbOUOn8eiBQv0IsNRhp8BNpnMFksVutNiRdLA1Og1GB7OgAGa4qbIWxSKSkSHhQYjMbwyazeaLZZrDZqY6JU6pbQXRA+By+VzudxfWq+TLGD4IPyZH7uFwuTqdIwuPy-ILBEDzCBwHRUgZEE4qM480AZAC0mSl5rcRnsLxFmWyVgMrjaRis4P10NwEAANmAjSlNKa9IhMr5crZ5e5o2V-H93hZrK77FI2pkuqCrFIFVJMl6+tSiDC6QjGciWWi1EGTelPm0pPYDH8rLVAS2VVbkwg2+4br5XrnG-LgZ6NUA */
      id: `filterMachine_${params.filterUrlKey}`,
      initial: 'idle',
      context: {
        URLKey: params.filterUrlKey,
        filterParamsKey: params.filterParamsKey,
        filterState: null
      },
      entry: [
        'assignInitialStateFromURLParam'
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
}
