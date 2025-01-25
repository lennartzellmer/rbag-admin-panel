import { describe, it } from 'vitest'
import { createActor } from 'xstate'
import { createFetchPaginatedMachine } from '../fetchPaginated.machine'
import { filterSearchMachine } from '../../../machines/filters/filterSearch.machine'

describe('filterMachin', () => {
  it('stores ininally on creation', () => new Promise((done) => {
    const actor = createActor(createFetchPaginatedMachine({
      filterMachines: [filterSearchMachine]
    }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event') {
          // console.log('inspectionEvent', inspectionEvent)
        }
      }
    })
    actor.start()
    console.log('actor', actor.getSnapshot().context)
    done('')
  }))
})
