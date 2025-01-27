/* eslint-disable @typescript-eslint/no-explicit-any */
import { assertEvent, assign, setup, type ActorRefFrom } from 'xstate'
import { paginationMachine } from '../pagination/pagination.machine'
import type { FilterConfig } from '../genericFilter/genericFilter.types'
import type { createFilterMachine } from '../genericFilter/genericFilter.machine'
import type { CollectionResponseList, PaginatedRequestParams } from '../../types/base.types'
import type { OutboundMachineEvents as OutboundFilterMachineEvents } from '../../machines/genericFilter/genericFilter.types'

// Define the shape of the fetch data function
export type FetchDataFilterParams = Record<string, any>
type FetchDataFunction = (paginationParams: PaginatedRequestParams, filterParams: ReturnType<FilterMachines[number]['machine']['getInitialSnapshot']>['context']['filterState']) => Promise<CollectionResponseList<any>>

// Define the shape of the filter machines
type FilterMachine<T extends FilterConfig<string>> = ReturnType<typeof createFilterMachine<string, T>>
type FilterMachines = ReadonlyArray<FilterMachine<any>>

// Before changing this next type read:
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// https://www.reddit.com/r/typescript/comments/128oibu/question_about_discriminated_unions_and_generics/
type SpawnedFilterMachine<TFilterMachine extends FilterMachine<any>> = TFilterMachine extends FilterMachine<any> ? { URLKey: ReturnType<TFilterMachine['machine']['getInitialSnapshot']>['context']['URLKey'], machine: ActorRefFrom<TFilterMachine> } : never
type SpawnedFilterMachines<TFilterMachines extends FilterMachines> = Readonly<{ [K in keyof TFilterMachines]: SpawnedFilterMachine<TFilterMachines[K]> }>
type SpawnedPaginationMachine = ActorRefFrom<typeof paginationMachine>

type ValidFilterMachines<TFilterMachines extends FilterMachines, TFilterParams extends FetchDataFilterParams> = {
  [K in keyof TFilterMachines]: Exclude<ReturnType<TFilterMachines[K]['machine']['getInitialSnapshot']>['context']['filterState'], null> extends Partial<TFilterParams> ? TFilterMachines[K] : never
}

// Define the shape of the paginated data machine
type PaginatedDataFactoryParams<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines> = {
  filterMachines?: readonly [...ValidFilterMachines<TFilterMachines, Parameters<TFetchDataFunction>[1]>]
}

export type MachineEvents<TFilterMachines extends FilterMachines> =
  | { type: 'RETRY' }
  | { type: 'PAGE_UPDATED', limit: number, offset: number }
  | OutboundFilterMachineEvents<ReturnType<TFilterMachines[number]['machine']['getInitialSnapshot']>['context']['filterState']>

export type MachineContext<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines> = {
  data: Awaited<ReturnType<TFetchDataFunction>>['data'] | null
  errorMessage?: string
  paginationMachineRef?: SpawnedPaginationMachine
  filterMachineRefs?: SpawnedFilterMachines<TFilterMachines>
  pagination: {
    limit: number
    offset: number
  }
  filter?: Partial<Parameters<TFetchDataFunction>[1]>
}

export function createFetchPaginatedMachine<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines>( //  TFetchDataFilterParams extends FetchDataFilterParams
  {
    filterMachines
  }: PaginatedDataFactoryParams<TFetchDataFunction, TFilterMachines>
) {
  return setup({
    types: {
      context: {} as MachineContext<TFetchDataFunction, TFilterMachines>,
      events: {} as MachineEvents<TFilterMachines>
    },
    actors: {
      paginationMachine
    },
    actions: {
      spawnPaginationActor: assign({
        paginationMachineRef: ({ spawn, context }) => {
          // Stop the pagination machine if it is already running
          context.paginationMachineRef?.stop()
          // Spawn a new pagination machine
          return spawn(paginationMachine, {
            input: {
              initialOffset: 0,
              initialLimit: 10
            }
          })
        }
      }),
      spawnFilterMachines: assign({
        filterMachineRefs: ({ spawn }) => {
          // The array if filtermachines is mapped to an array of objects
          // where the machine is a spawed version of the given filter state machine
          const spawnedFilterMachines = filterMachines?.map((filterMachine) => {
            const machine = spawn(filterMachine.machine)
            return {
              machine: machine,
              URLKey: machine.getSnapshot().context.URLKey
            }
          }) as SpawnedFilterMachines<TFilterMachines>
          return spawnedFilterMachines
        }
      }),
      getInitialFilterValues: assign({
        filter: ({ context }) => {
          const initialFilterValues = new Map<string, any>()
          context.filterMachineRefs?.forEach((filterMachineRef) => {
            const filterValue = filterMachineRef.machine
            initialFilterValues.set(filterMachine.config.filterParamsKey, filterValue)
          })
          return initialFilterValues
        }
      }),
      resetPaginationAndData: assign({
        pagination: ({ context }) => {
          return {
            offset: 0,
            limit: context.pagination.limit
          }
        },
        data: null
      }),
      assignFilterToContext: assign({
        filter: ({ context, event }) => {
          assertEvent(event, ['FILTER_UPDATED'])
          return {
            ...context.filter,
            ...event.filter
          }
        }
      }),
      removeFilterFromContext: assign({
        filter: ({ context, event }) => {
          assertEvent(event, ['FILTER_RESET'])
          if (!context.filter)
            return undefined

          const newFilter = { ...context.filter }

          event.filterParamsKey.forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete newFilter[key]
          })

          const isEmptyObject = Object.keys(newFilter).length === 0
          if (isEmptyObject)
            return undefined

          return newFilter
        }
      })
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGhgzACcBLAYwDEwAXcgC0tIBsaTIAFAQylIy7YQAIgK4BZLgz5h8IAA5ZYpGqSwZZAD0QAGdAE8dyNCEIkK1OoxZtinHnwGQRNcZPrSAdKQjMZSeYrKqur+WggALAAc+ogAjACsAJwe4YlpkeEA7OGxAEyx2onhRkZAA */
    id: 'genericFetchFilteredPaginatedDataMachine',
    initial: 'fetching',
    context: {
      data: null,
      filter: [],
      pagination: {
        offset: 0,
        limit: 10
      }
    },
    entry: ['spawnPaginationActor', 'spawnFilterMachines', 'getInitialFilterValues'],
    on: {
      FILTER_UPDATED: {
        target: '.fetching',
        actions: [
          'assignFilterToContext',
          'resetPaginationAndData',
          'spawnPaginationActor'
        ]
      },
      FILTER_RESET: {
        target: '.fetching',
        actions: [
          'removeFilterFromContext',
          'resetPaginationAndData',
          'spawnPaginationActor'
        ]
      }
    },
    states: {
      fetching: {}
    }
  })
}
