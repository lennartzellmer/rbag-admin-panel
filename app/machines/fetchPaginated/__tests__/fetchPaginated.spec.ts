import { describe, expect, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'
import { createFilterMachine } from '../../genericFilter/genericFilter.machine'

const firstTestFilterMachine = createFilterMachine({
  filterUrlKey: 'testUrlKey1',
  filterParamsKey: 'testParamsKey1',
  filterValueGetter: () => ({
    filterParamsKey: 'testParamsKey1',
    filterValue: new URLSearchParams('foo=testValue1')
  })
})

const secondTestFilterMachine = createFilterMachine({
  filterUrlKey: 'testUrlKey2',
  filterParamsKey: 'testParamsKey2',
  filterValueGetter: () => ({
    filterParamsKey: 'testParamsKey2',
    filterValue: new URLSearchParams('foo=testValue2')
  })
})

describe('fetchPaginatedMachine', () => {
  it('stores ininal filter values on creation', () => new Promise((done) => {
    const actor = createActor(createFetchPaginatedMachine({ filterMachines: [firstTestFilterMachine, secondTestFilterMachine] }))
    actor.start()
    // check if the filter values are stored in the context are the correct map of

    expect(actor.getSnapshot().context.filter).toEqual([
      { testParamsKey1: 'testValue1' },
      { testParamsKey2: 'testValue2' }
    ])
    done('')
  }))
})
