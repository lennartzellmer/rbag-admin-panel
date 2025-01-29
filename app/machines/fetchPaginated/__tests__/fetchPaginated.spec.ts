import { describe, expect, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'
import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'

describe('fetchPaginatedMachine', () => {
  // function mockFetchDataFunction({ paginationParams }: { paginationParams: PaginatedRequestParams }): Promise<CollectionResponseList<unknown>> {
  //   const mockData = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12', 'test13', 'test14', 'test15', 'test16', 'test17', 'test18', 'test19', 'test20']
  //   return Promise.resolve({
  //     data: mockData.slice(paginationParams.offset, paginationParams.offset + paginationParams.limit),
  //     totalCount: mockData.length
  //   })
  // }

  // it('fetches initial data with default pagination', () => new Promise((done) => {
  //   const actor = createActor(createFetchPaginatedMachine({ fetchDataFunction: mockFetchDataFunction })).start()
  //   actor.subscribe((state) => {
  //     expect(state.matches({ idle: 'dataAvailable' })).toBe(true)
  //     expect(state.context.data).toEqual(['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10'])
  //     done('')
  //   })
  // }))
})
