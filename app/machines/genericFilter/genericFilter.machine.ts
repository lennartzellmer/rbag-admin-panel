import { assign, createMachine, sendParent } from 'xstate'
import type { GetterReturnType, InboundMachineEvents, MachineContext, OutboundMachineEvents } from './genericFilter.types'

export function createFilterMachine<TUrlKey extends string, TGetterReturnType extends GetterReturnType>(
  params: {
    filterUrlKey: TUrlKey
    filterParamsKeys: Array<keyof NonNullable<TGetterReturnType>>
    filterValueGetter: (URLKey: TUrlKey) => TGetterReturnType
  },
) {
  return createMachine(
    {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgGUBRAFQH0AxASQBkqKAlGgEQoCEB5AKoA5AMIVOAbQAMAXUSgADgHtYuAC64l+eSAAeiAMwBGKQDojATikWjANgsAOBwBYnRgDQgAnogC0RgCYHU1cpAHYggFYwiwCrWwcAX0TPNCw8QlJKWkYWdmk5JBBlVQ0tHX0EBzCzaIMEo2jnawtbTx8EfzCjUxqAg27IqWMA5zDk1IwcAmJTAHd0dQIoOiUAJwBBfCU1bDA1igA3MHw1EhE+IUY2AFkCnRKl8qLK2wDI8ycAy1tIk0b2ogAlIPpExg5fkMIlJAhMQGlppl5osNPgVustjs9gdjqcSLpYGp0GowKZ0AAzElrZAOKRSUgIjKzBZLNGrTbbXb7I4nNT3IqPMraF6IN4GUz2Zr2BwBMJDAKAhCNcVOZxWAJxJwggzOZIpEDbCBwHSMmZEB4qJ7C0CVd5mCw2b50qTOAwWMK2NrePwGYymBxDBxGGVGIzOcNGOGmpG4CAAGzAFtKmmtekQFgMZjCYWqtjVwwSzgV3qVkQCphBGo1HocGe6UamTKIyNZ6I5WO5uLUSatFSBjlMDsCJjprvdnsVRgMwQsatGUneOYiQT1iSAA */
      id: `filterMachine_${params.filterUrlKey}`,
      initial: 'idle',
      schema: {
        context: {} as MachineContext<TGetterReturnType, TUrlKey>,
        events: {} as InboundMachineEvents<TGetterReturnType>,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./genericFilter.machine.typegen').Typegen0,
      entry: [
        'assignInitialStateFromURLParam',
        'informParentMachine',
      ],

      context: {
        URLKey: params.filterUrlKey,
        filterParamsKeys: params.filterParamsKeys,
        filterValue: null,
      },

      states: {
        idle: {},

        waitingForAnotherEvent: {
          exit: [
            'setOrDeleteURLParam',
            'informParentMachine',
          ],
          after: {
            800: 'idle',
          },

          on: {
            CONFIRM: 'idle',
          },
        },
      },

      on: {
        SET_FILTER_DEBOUNCED: {
          target: '.waitingForAnotherEvent',
          actions: 'assignFilterValue',
        },
        SET_FILTER: {
          target: '.idle',
          actions: [
            'assignFilterValue',
            'setOrDeleteURLParam',
            'informParentMachine',
          ],
        },
      },
    },
    {
      actions: {
        assignInitialStateFromURLParam: assign({
          filterValue: ({ URLKey }) => params.filterValueGetter(URLKey),
        }),

        assignFilterValue: assign({
          filterValue: (_, event) => event.payload ? event.payload : null,
        }),

        informParentMachine: sendParent(({ filterValue, filterParamsKeys }) => {
          if (filterValue) {
            return {
              type: 'FILTER_UPDATED',
              filter: filterValue,
            } satisfies OutboundMachineEvents<TGetterReturnType>
          }
          else {
            return {
              type: 'FILTER_RESET',
              filterParamsKeys,
            } satisfies OutboundMachineEvents<TGetterReturnType>
          }
        }),

        setOrDeleteURLParam: ({ URLKey, filterValue }) => {
          const url = new URL(window.location.href)

          if (filterValue?.[URLKey])
            url.searchParams.set(URLKey, filterValue[URLKey])
          else
            url.searchParams.delete(URLKey)

          window.history.replaceState(history.state, '', url)
        },
      },
    },
  )
}
