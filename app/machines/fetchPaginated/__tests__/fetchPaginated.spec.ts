import { describe, expect, it } from 'vitest'
import { createActor, waitFor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'
import type { CollectionResponseList, PaginatedRequestParams } from '~/types/base.types'

describe('fetchPaginatedMachine', () => {
  function mockFetchDataFunction({ paginationParams }: { paginationParams: PaginatedRequestParams }): Promise<CollectionResponseList<unknown>> {
    const mockData = Array.from({ length: 40 }, (_, index) => `test_${index}`)
    return Promise.resolve({
      data: mockData.slice(paginationParams.offset, paginationParams.offset + paginationParams.limit),
      totalCount: mockData.length
    })
  }

  it('waits on initial pagination as first state', () => new Promise((done) => {
    const machine = createFetchPaginatedMachine({ fetchDataFunction: mockFetchDataFunction })
    const actor = createActor(machine)
    expect(actor.getSnapshot().value).toEqual('waitForInitialPagination')
    done('')
  }))

  it('fetches initial data with default pagination', async () => {
    const machine = createFetchPaginatedMachine({ fetchDataFunction: mockFetchDataFunction })
    const actor = createActor(machine).start()
    const state = await waitFor(actor, state => state.matches('idle'))
    expect(state.matches({ idle: 'dataAvailable' })).toBe(true)
    expect(state.context.data).toEqual(['test_0', 'test_1', 'test_2', 'test_3', 'test_4', 'test_5', 'test_6', 'test_7', 'test_8', 'test_9'])
  })

  it('fetches data with updated pagination', async () => {
    const machine = createFetchPaginatedMachine({ fetchDataFunction: mockFetchDataFunction })
    const actor = createActor(machine).start()
    await waitFor(actor, state => state.matches({ idle: 'dataAvailable' }))
    actor.send({ type: 'PAGE_UPDATED', pagination: { offset: 10, limit: 10 } })
    const state = await waitFor(actor, state => state.matches({ idle: 'dataAvailable' }))
    expect(state.matches({ idle: 'dataAvailable' })).toBe(true)
    expect(state.context.data).toEqual(['test_10', 'test_11', 'test_12', 'test_13', 'test_14', 'test_15', 'test_16', 'test_17', 'test_18', 'test_19'])
  })

  it('goes to error state if fetchDataFunction throws', async () => {
    const machine = createFetchPaginatedMachine({ fetchDataFunction: () => Promise.reject(new Error('test')) })
    const actor = createActor(machine).start()
    await waitFor(actor, state => state.matches('error'))
    expect(actor.getSnapshot().value).toEqual('error')
  })

  it('goes to fetching after error on retry ', async () => {
    const machine = createFetchPaginatedMachine({ fetchDataFunction: () => Promise.reject(new Error('test')) })
    const actor = createActor(machine).start()
    await waitFor(actor, state => state.matches('error'))
    actor.send({ type: 'RETRY' })
    const state = await waitFor(actor, state => state.matches('fetching'))
    expect(state.matches('fetching')).toBe(true)
  })
})
