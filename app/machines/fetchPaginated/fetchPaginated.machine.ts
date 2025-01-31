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
  | { type: 'PAGE_UPDATED', pagination: PaginatedRequestParams }

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
          return spawn('paginationMachine', {
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
    /** @xstate-layout N4IgpgJg5mDOIC5QDMwBcDGALACgQygEsA7PNSAWT2xLADoB3PQtAMQHsAnASWJcLwAbfEVJpC7YgGIcAQQDiAUQD6AVRwARWQBVFGgNoAGALqJQAB3ax+ksyAAeiAEyHDdAKyGALE4CcADgA2AEZ3f2D-fwAaEABPZ383fwBmQ38fL18nJ0CvQIBffJjUTFwCEjJKaixaOhKaYigpCEl6EgA3dgBrenqy0UqIKgbe9AaoBA72DDIJYiNjBbtLa3FbJAdEAFonZKc6AK93YIB2Qz9k90vkmPiEMP8D32ffE99k09cTwuKx-oryENqrU+iQmi1iG1iJ0enU-iIAVURnDSmDJtDprNJAt9MFTBsVjZiHZHAgdhE6MFDO5Ak5gvScgFkidbogTslfB4qdTmU5-Gc9j8QH0EWIkTVISjxlIwJxOFw6OZBGRkFwALZS-5ioHI0GNdGdGZreYmJYEqxEknbJxHOjpdKBfxXdxZLzeVkIVLuOipE5uzJZHJ5IUi8ra4YS+iy+WcKQAJUU2jjAE0zRYLcarWSOZTvIEXfnkskvGdgh7Usk7YZ2eEjtlTukQ-Cw4MI7VCBBBGAZAoVOotLoDCZlhm5ln6Sc6IFni4UgLXMcPcdK3lgr5jl5wo6IoUiiBiOwIHA7KGBoC25CR6sxxtSTt3nbN3knZdXe64ttHXRdilgoFHY6dZNqUoqtsCkpMCwHA8Hw4hCKBmbmte6ygKSTgnJOnhXCktIYe4zoev+34hIBJx+IYez+E4wHYAh4ogn8YJXpat7bBEwQ+mRHJep8uwsh+CBHIE367E4Vw+P466hDRWpgci0ZcMxiGoWxwSVsu5zoRcfInGWAnZJWrjvDSQS+D4gTMjJdE6pGdAdl2Sk3ipnrrnQbyOskgQnPyFnBDkS45AcVx+X+OSeZJVktue4FtJ29AQGQeCyO0zDKgARg5SEsc5XheJW7k4d5Jy+f5AkhF4dBHB8wR5HlLp+ZFZ70ZK9n0AeGiJY5KGbIJtozmc+HscVNwCTWdCGNy+FFqEYm7vkQA */
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
                params: ({ event }) => (event.pagination)
              }
            ]
          }
        }
      },
      fetching: {
        invoke: {
          src: 'fetchDataActor',
          input: ({ context }) => ({
            url: 'url',
            pagination: context.pagination
          }),
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
        },
        on: {
          PAGE_UPDATED: {
            target: 'fetching',
            actions: [
              {
                type: 'assignLimitAndOffsetToContext',
                params: ({ event }) => (event.pagination)
              }
            ]
          }
        }
      }
    }
  })
}
