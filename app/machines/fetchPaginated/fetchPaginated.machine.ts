import { assign, fromPromise, setup, type ActorRefFrom } from 'xstate'
import { paginationMachine } from '../pagination/pagination.machine'
import type { CollectionResponseList, PaginatedRequestParams } from '../../types/base.types'

export type FetchDataFunction = ({ paginationParams }: { paginationParams: PaginatedRequestParams }) => Promise<CollectionResponseList<unknown>>

type SpawnedPaginationMachine = ActorRefFrom<typeof paginationMachine>

// Define the shape of the paginated data machine
type PaginatedDataFactoryParams<TFetchDataFunction extends FetchDataFunction> = {
  fetchDataFunction: TFetchDataFunction
  append?: boolean
}

export type MachineEvents =
  | { type: 'RETRY' }
  | { type: 'PAGE_UPDATED', limit: number, offset: number }

export type MachineContext<TFetchDataFunction extends FetchDataFunction> = {
  data: Awaited<ReturnType<TFetchDataFunction>>['data']
  errorMessage?: string
  paginationMachineRef?: SpawnedPaginationMachine
  pagination: {
    limit: number
    offset: number
  }
  append: boolean
}

export function createFetchPaginatedMachine<TFetchDataFunction extends FetchDataFunction>(
  {
    fetchDataFunction,
    append = false
  }: PaginatedDataFactoryParams<TFetchDataFunction>
) {
  return setup({
    types: {
      context: {} as MachineContext<TFetchDataFunction>,
      events: {} as MachineEvents
    },
    actors: {
      paginationMachine,
      fetchDataActor: fromPromise(async ({ input }: { input: { pagination: PaginatedRequestParams } }) => {
        return await fetchDataFunction({ paginationParams: input.pagination })
      })
    },
    actions: {
      spawnPaginationActor: assign({
        paginationMachineRef: ({ spawn, context }) => {
          // Stop the pagination machine if it is already running
          context.paginationMachineRef?.stop()
          // Spawn a new pagination machine
          return spawn(paginationMachine, {
            input: {
              initialOffset: context.pagination.offset,
              initialLimit: context.pagination.limit
            }
          })
        }
      }),
      resetPaginationAndData: assign({
        pagination: ({ context }) => {
          return {
            offset: 0,
            limit: context.pagination.limit
          }
        },
        data: []
      }),
      appendOrAssignDataToContext: assign({
        data: ({ context }, params: CollectionResponseList<unknown>) => {
          if (append) {
            if (context.data === null || context.data === undefined)
              return params.data
            return context.data.concat(params.data)
          }
          return params.data
        }
      }),
      sendTotalCountToPaginationMachine: ({ context }, params: CollectionResponseList<unknown>) => {
        context.paginationMachineRef?.send({
          type: 'UPDATE_TOTAL_COUNT',
          totalCount: params.totalCount || 0
        })
      },
      assignLimitAndOffsetToContext: assign({
        pagination: (_, params: { offset: number, limit: number }) => {
          return {
            offset: params.offset,
            limit: params.limit
          }
        }
      })
    },
    guards: {
      isDataAvailable: ({ context }, params: CollectionResponseList<unknown>) => {
        // If we are in append mode and data is available in context, return true
        if (append && context.data && context.data.length > 0)
          return true

        // If fetch delivered no data (undefined or null), return false
        if (params.data === undefined || params.data === null)
          return false

        // If fetch delivered no data (empty array), return false
        if (Array.isArray(params.data) && params.data.length === 0)
          return false

        // Fetch delivered data, return true
        return true
      }
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGhgzACcBLAYwDEwAXcgC0tIBsaTIAFAQylIy7YQAIgK4BZLgz5h8IAA5ZYpGqSwZZAD0QAGdAE8dyNCEIkK1OoxZtinHnwGQRNcZPrSAdKQjMZSeYrKqur+WggALAAc+ogAjACsAJwe4YlpkeEA7OGxAEyx2onhRkZAA */
    id: 'fetchPaginatedMachine',
    initial: 'waitForInitialPagination',
    context: {
      data: [],
      append,
      pagination: {
        offset: 0,
        limit: 10
      }
    },
    entry: ['spawnPaginationActor'],
    states: {
      waitForInitialPagination: {
        on: {
          PAGE_UPDATED: {
            target: 'fetching',
            actions: [
              {
                type: 'assignLimitAndOffsetToContext',
                params: ({ event }) => ({ limit: event.offset, offset: event.limit })
              }
            ]
          }
        }
      },
      fetching: {
        invoke: {
          src: 'fetchDataActor',
          input: {
            url: 'url',
            pagination: {
              offset: 0,
              limit: 10
            }
          },
          onDone: [
            {
              guard: { type: 'isDataAvailable', params: ({ event }) => ({ ...event.output }) },
              target: 'idle.dataAvailable',
              actions: [
                {
                  type: 'appendOrAssignDataToContext',
                  params: ({ event }) => ({ ...event.output })
                },
                {
                  type: 'sendTotalCountToPaginationMachine',
                  params: ({ event }) => ({ ...event.output })
                }
              ]
            },
            {
              target: 'idle.noData'
            }
          ],
          onError: {
            target: 'error'
          }
        }
      },
      error: {
        on: {
          RETRY: {
            target: 'fetching'
          }
        }
      },
      idle: {
        initial: 'dataAvailable',
        states: {
          dataAvailable: {
          },
          noData: {}
        }
      }
    }
  })
}
