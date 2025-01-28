import { beforeEach, describe, expect, it } from 'vitest'
import { createActor, createEmptyActor } from 'xstate'
import { filterSearchMachine } from '../filterSearch.machine'

describe('filterSearchMachine', () => {
  beforeEach(() => {
    global.window = Object.create(window)
    const url = new URL('https://www.example.com')
    url.searchParams.set('searchTerm', 'test')
    Object.defineProperty(window, 'location', {
      value: url
    })
  })

  it('stores filter from URL on creation', () => new Promise((done) => {
    const parent = createEmptyActor()
    const actor = createActor(filterSearchMachine.machine, { parent }).start()

    const filterValue = new URLSearchParams()
    filterValue.set('search', 'test')
    console.log(actor.getSnapshot().context.filterState?.filterValue.toString())
    expect(actor.getSnapshot().context.filterState).toEqual({ filterParamsKey: 'search', filterValue: filterValue })
    done('')
  }))
})
