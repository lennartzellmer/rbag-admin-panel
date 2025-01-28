import { describe, expect, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine, type FetchDataFunction } from '../fetchPaginated.machine'
import type { PaginatedRequestParams } from '~/types/base.types'

describe('filterSearchMachine', () => {
  // Mock the useFetch function

  const fetchDataFunction: FetchDataFunction = async ({ paginationParams }: { paginationParams: PaginatedRequestParams }) => {
    const res = await useRequestFetch()('/api/users', {
      params: {
        offset: paginationParams.offset,
        limit: paginationParams.limit
      }
    })
    return res
  }

  it('stores filter from URL on creation', () => new Promise((done) => {
    const actor = createActor(createFetchPaginatedMachine({ fetchDataFunction: fetchDataFunction })).start()

    const filterValue = new URLSearchParams()
    filterValue.set('search', 'test')
    console.log(actor.getSnapshot().context.filterState?.filterValue.toString())
    expect(actor.getSnapshot().context.filterState).toEqual({ filterParamsKey: 'search', filterValue: filterValue })
    done('')
  }))
})
