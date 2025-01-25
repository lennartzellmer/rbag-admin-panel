/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios'
import type { ActorRefFrom } from 'xstate'
import type { CollectionResponseList, PaginatedRequestParams } from '../../types/base.types'
import type { createPaginationOffsetLimitMachine } from '../pagination/paginationOffsetLimit.machine'
import type { GetterReturnType, OutboundMachineEvents as OutboundFilterMachineEvents } from '../../machines/genericFilter/genericFilter.types'
import type { createFilterMachine } from '../../machines/genericFilter/genericFilter.machine'
import type { FetchResult } from '#app'

/**
 * Define the parameters of the filter machines creation function first.
 * We need some helpers and checks to make sure the filter machines are valid.
 *
 * TODO: These types do not check if all necessary (non optional) parameters are present
 * in either the initialFilter or the filterMachines. That means it is not checked if the entire object is covered.
 */

// Define the shape of the fetch data function
export type FetchDataFilterParams = { [key: string]: any }
export type FetchDataFunction = (paginationParams: PaginatedRequestParams, filterParams: any) => Promise<FetchResult<CollectionResponseList<any>>>

// Define the shape of the filter machines
export type FilterMachine<T extends GetterReturnType> = ReturnType<typeof createFilterMachine<any, T>>
export type FilterMachines = ReadonlyArray<FilterMachine<any>>

export type ValidFilterMachines<TFilterMachines extends FilterMachines, TFilterParams extends FetchDataFilterParams> = {
  [K in keyof TFilterMachines]: Exclude<TFilterMachines[K]['context']['filterValue'], null> extends Partial<TFilterParams> ? TFilterMachines[K] : never
}

// Define the shape of the paginated data machine
export type PaginatedDataFactoryParams<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines> = {
  fetchDataFunction: TFetchDataFunction
  filterMachines?: readonly [...ValidFilterMachines<TFilterMachines, Parameters<TFetchDataFunction>[1]>]
  initialOffset: number
  initialLimit: number
  initialFilter?: Partial<Parameters<TFetchDataFunction>[1]>
  append?: boolean
}

// Before changing this next type read:
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// https://www.reddit.com/r/typescript/comments/128oibu/question_about_discriminated_unions_and_generics/
export type SpawnedFilterMachine<TFilterMachine extends FilterMachine<any>> = TFilterMachine extends FilterMachine<any> ? { URLKey: TFilterMachine['context']['URLKey'], machine: ActorRefFrom<TFilterMachine> } : never
export type SpawnedFilterMachines<TFilterMachines extends FilterMachines> = Readonly<{ [K in keyof TFilterMachines]: SpawnedFilterMachine<TFilterMachines[K]> }>
export type SpawnedPaginationMachine = ActorRefFrom<ReturnType<typeof createPaginationOffsetLimitMachine>>

export type MachineContext<TFetchDataFunction extends FetchDataFunction, TFilterMachines extends FilterMachines> = {
  data: Awaited<ReturnType<TFetchDataFunction>>['data']['data'] | null
  errorMessage?: string
  paginationMachineRef?: SpawnedPaginationMachine
  filterMachineRefs?: SpawnedFilterMachines<TFilterMachines>
  pagination: {
    limit: number
    offset: number
  }
  filter?: Partial<Parameters<TFetchDataFunction>[1]>
}

export type MachineEvents<TFilterMachines extends FilterMachines> =
  | { type: 'RETRY' }
  | { type: 'PAGE_UPDATED', limit: number, offset: number }
  | OutboundFilterMachineEvents<TFilterMachines[number]['context']['filterValue']>

export type MachineServices<TFetchDataFunction extends FetchDataFunction> = {
  fetchData: {
    data: Awaited<ReturnType<TFetchDataFunction>>['data']
  }
}
