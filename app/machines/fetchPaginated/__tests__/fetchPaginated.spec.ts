import { describe, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'

describe('filterMachin', () => {
  it('stores ininally on creation', () => new Promise((done) => {
    const actor = createActor(createFetchPaginatedMachine({}))
    actor.start()
    done('')
  }))
})
