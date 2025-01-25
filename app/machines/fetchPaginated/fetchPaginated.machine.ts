/* eslint-disable @typescript-eslint/no-explicit-any */
import { assign, setup, type ActorRefFrom } from 'xstate'
import { paginationMachine } from '../pagination/pagination.machine'
import type { GetterReturnType } from '../genericFilter/genericFilter.types'
import type { createFilterMachine } from '../genericFilter/genericFilter.machine'
import type { CollectionResponseList, PaginatedRequestParams } from '../../types/base.types'

// Define the shape of the fetch data function
type FetchDataFilterParams = { [key: string]: any }
type FetchDataFunction = (paginationParams: PaginatedRequestParams, filterParams: any) => Promise<CollectionResponseList<any>>

// Define the shape of the filter machines
type FilterMachine<T extends GetterReturnType> = ReturnType<typeof createFilterMachine<string, T>>
type FilterMachines = ReadonlyArray<FilterMachine<any>>

// Before changing this next type read:
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// https://www.reddit.com/r/typescript/comments/128oibu/question_about_discriminated_unions_and_generics/
type SpawnedFilterMachine<TFilterMachine extends FilterMachine<any>> = TFilterMachine extends FilterMachine<any> ? { URLKey: ReturnType<TFilterMachine['getInitialSnapshot']>['context']['URLKey'], machine: ActorRefFrom<TFilterMachine> } : never
type SpawnedFilterMachines<TFilterMachines extends FilterMachines> = Readonly<{ [K in keyof TFilterMachines]: SpawnedFilterMachine<TFilterMachines[K]> }>
type SpawnedPaginationMachine = ActorRefFrom<typeof paginationMachine>

type ValidFilterMachines<TFilterMachines extends FilterMachines, TFilterParams extends FetchDataFilterParams> = {
  [K in keyof TFilterMachines]: Exclude<ReturnType<TFilterMachines[K]['getInitialSnapshot']>['context']['filterValue'], null> extends Partial<TFilterParams> ? TFilterMachines[K] : never
}

// Define the shape of the paginated data machine
type PaginatedDataFactoryParams<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines> = {
  filterMachines?: readonly [...ValidFilterMachines<TFilterMachines, Parameters<TFetchDataFunction>[1]>]
}

export function createFetchPaginatedMachine<TFetchedDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines>( //  TFetchDataFilterParams extends FetchDataFilterParams
  {
    filterMachines
  }: PaginatedDataFactoryParams<TFetchedDataFunction, TFilterMachines>
) {
  return setup({
    types: {
      context: {} as {
        paginationMachineRef?: SpawnedPaginationMachine
        filterMachineRefs?: SpawnedFilterMachines<TFilterMachines>
      }
    },
    actors: {
      paginationMachine
    },
    actions: {
      spawnPaginationActor: assign({
        paginationMachineRef: ({ spawn }) => spawn(paginationMachine, {
          input: {
            initialOffset: 0,
            initialLimit: 10
          }
        })
      }),
      spawnFilterMachines: assign({
        filterMachineRefs: ({ spawn }) => {
          // The array if filtermachines is mapped to an array of objects
          // where the machine is a spawed version of the given filter state machine
          const spawnedFilterMachines = filterMachines?.map((filterMachine) => {
            return {
              machine: spawn(filterMachine),
              // @ts-expect-error - The context is not typed correctly by xstate
              URLKey: filterMachine.config.context.URLKey
            }
          }) as SpawnedFilterMachines<TFilterMachines>
          return spawnedFilterMachines
        }
      })
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGhgzACcBLAYwDEwAXcgC0tIBsaTIAFAQylIy7YQAIgK4BZLgz5h8IAA5ZYpGqSwZZAD0QAGdAE8dyNCEIkK1OoxZtinHnwGQRNcZPrSAdKQjMZSeYrKqur+WggALAAc+ogAjACsAJwe4YlpkeEA7OGxAEyx2onhRkZAA */
    id: 'genericFetchFilteredPaginatedDataMachine',
    entry: ['spawnPaginationActor', 'spawnFilterMachines'],
    initial: 'idle',
    states: {
      idle: {}
    }
  })
}
