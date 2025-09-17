import { describe, expect, it } from 'vitest'
import { createActor, createEmptyActor, createMachine } from 'xstate'
import { createFilterMachine } from '../genericFilter.machine'

const URL_KEY = 'foo'
const FILTER_PARAMS_KEY = 'bar'
const TEST_FILTER_VALUE = new URLSearchParams('foo=bar')

const filterTestMachine = createFilterMachine({
  filterUrlKey: URL_KEY,
  filterParamsKey: FILTER_PARAMS_KEY,
  filterValueGetter: () => ({
    filterParamsKey: FILTER_PARAMS_KEY,
    filterValue: TEST_FILTER_VALUE
  })
})

describe('filterMachineStoresInternally', () => {
  it('stores initial filter value internally on creation', () => new Promise((done) => {
    const parent = createEmptyActor()
    const actor = createActor(filterTestMachine.machine, { parent })
    expect(actor.getSnapshot().context.filterState).toStrictEqual({
      filterParamsKey: FILTER_PARAMS_KEY,
      filterValue: TEST_FILTER_VALUE
    })
    done('')
  }))

  it('update stored filter on SET_FILTER', () => new Promise((done) => {
    const parent = createEmptyActor()
    const actor = createActor(filterTestMachine.machine, { parent })
    actor.start()
    actor.send({
      type: 'SET_FILTER', payload: {
        filterParamsKey: FILTER_PARAMS_KEY, filterValue: new URLSearchParams('foo=updatedValue')
      }
    })
    expect(actor.getSnapshot().context.filterState).toStrictEqual({
      filterParamsKey: FILTER_PARAMS_KEY, filterValue: new URLSearchParams('foo=updatedValue')
    })
    done('')
  }))
})

describe('filterMachineCommunicatesToParent', () => {
  it('sends FILTER_UPDATED event to parent when filter is updated', () => new Promise((done) => {
    const filterValue = new URLSearchParams()
    filterValue.set('foo', 'secondEvent')
    let receivedEvent = undefined
    const parent = createActor(createMachine({ id: 'parent' }), {
      inspect(inspEvent) {
        // Only respond to actual XState events
        if (inspEvent.type === '@xstate.event' && inspEvent.event.type === 'FILTER_UPDATED') {
          // Check if it has the specific data we want
          if (inspEvent.event.filter?.filterValue.get('foo') === 'secondEvent') {
            receivedEvent = inspEvent.event
          }
        }
      }
    })
    const actor = createActor(filterTestMachine.machine, { parent }).start()
    actor.send({ type: 'SET_FILTER', payload: { filterParamsKey: FILTER_PARAMS_KEY, filterValue: filterValue } })
    expect(receivedEvent).toEqual({ type: 'FILTER_UPDATED', filter: { filterParamsKey: FILTER_PARAMS_KEY, filterValue: filterValue } })
    done('')
  }))

  it('sends FILTER_RESET event to parent when filter is removed', () => new Promise((done) => {
    let receivedEvent = undefined
    const parent = createActor(createMachine({ id: 'parent' }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event' && inspectionEvent.event.type === 'FILTER_RESET') {
          receivedEvent = inspectionEvent.event
        }
      }
    })
    const actor = createActor(filterTestMachine.machine, { parent }).start()
    actor.send({ type: 'SET_FILTER', payload: null })

    expect(receivedEvent).toEqual({ type: 'FILTER_RESET', filterParamsKey: FILTER_PARAMS_KEY })
    done('')
  }))
})
