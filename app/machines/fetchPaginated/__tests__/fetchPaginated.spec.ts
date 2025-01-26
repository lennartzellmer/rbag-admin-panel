import { describe, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'
import { filterSearchMachine } from '../../../machines/filters/filterSearch.machine'

describe('fetchPaginatedMachine', () => {
  it('stores ininally on creation', () => new Promise((done) => {
    global.window = Object.create(window)
    const url = new URL('https://www.example.com')
    url.searchParams.set('searchTerm', 'test')
    Object.defineProperty(window, 'location', {
      value: url
    })

    const actor = createActor(createFetchPaginatedMachine({
      filterMachines: [filterSearchMachine]
    }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event') {
          console.log('inspectionEvent', inspectionEvent.event)
        }
      }
    })
    actor.start()
    done('')
  }))
})
