import { describe, expect, it } from 'vitest'
import { createActor, assign, setup } from 'xstate'
import { createFilterMachine } from '../genericFilter.machine'

const URL_KEY = 'foo'
const TEST_VALUE = 'firstEvent'

const filterTestMachine = createFilterMachine({
  filterUrlKey: URL_KEY,
  filterParamsKeys: [URL_KEY],
  filterValueGetter: () => ({ [URL_KEY]: TEST_VALUE })
})

const parentMachine = setup({
  actors: {
    filterTestMachine
  }
}).createMachine({
  initial: 'idle',
  context: {
    receivedInitialFilter: false
  },
  states: {
    idle: {
      invoke: {
        id: 'filterTestMachine',
        src: 'filterTestMachine'
      },
      on: {
        FILTER_UPDATED: {
          actions: assign({
            receivedInitialFilter: true
          })
        }
      }
    }
  }
})

describe('filterMachineStoresInternally', () => {
  it('stores initial filter value internally on creation', () => new Promise((done) => {
    const actor = createActor(parentMachine)
    actor.start()

    expect(actor.getSnapshot().children.filterTestMachine?.getSnapshot().context.filterValue).toStrictEqual({ [URL_KEY]: TEST_VALUE })
    done('')
  }))

  it('update stored filter on SET_FILTER', () => new Promise((done) => {
    const UPDATED_VALUE = 'updatedValue'

    const actor = createActor(parentMachine)
    actor.start()

    actor.getSnapshot().children.filterTestMachine?.send({ type: 'SET_FILTER', payload: { [URL_KEY]: UPDATED_VALUE } })
    expect(actor.getSnapshot().children.filterTestMachine?.getSnapshot().context.filterValue).toStrictEqual({ [URL_KEY]: UPDATED_VALUE })
    done('')
  }))
})

describe('filterMachineCommunicatesToParent', () => {
  it('sends FILTER_UPDATED event to parent on creation', () => new Promise((done) => {
    const actor = createActor(parentMachine, {
      // Use inspect to check if the FILTER_UPDATED event is received on the parent
      inspect: (inspEvent) => {
        if (inspEvent.type === '@xstate.event') {
          if (inspEvent.event.type === 'FILTER_UPDATED') {
            expect(inspEvent.event).toEqual({ type: 'FILTER_UPDATED', filter: { foo: 'firstEvent' } })
            done('')
          }
        }
      }
    })

    actor.start()
  }))

  it('sends FILTER_UPDATED event to parent when filter is updated', () => new Promise((done) => {
    const actor = createActor(parentMachine, {
      // Use inspect to check if the FILTER_UPDATED event is received on the parent
      inspect: (inspEvent) => {
        // Only respond to actual XState events
        if (inspEvent.type === '@xstate.event') {
          // Only respond to FILTER_UPDATED events
          if (inspEvent.event.type === 'FILTER_UPDATED') {
            // Check if it has the specific data we want
            if (inspEvent.event.filter?.foo === 'secondEvent') {
              expect(inspEvent.event).toEqual({ type: 'FILTER_UPDATED', filter: { foo: 'secondEvent' } })
              done('')
            }
          }
        }
      }
    })

    actor.start()

    actor.getSnapshot().children.filterTestMachine?.send({ type: 'SET_FILTER', payload: { foo: 'secondEvent' } })
  }))

  it('sends FILTER_RESET event to parent when filter is removed', () => new Promise((done) => {
    const actor = createActor(parentMachine, {
      // Use inspect to check if the FILTER_UPDATED event is received on the parent
      inspect: (inspEvent) => {
        // Only respond to actual XState events
        if (inspEvent.type === '@xstate.event') {
          // Only respond to FILTER_UPDATED events
          if (inspEvent.event.type === 'FILTER_RESET') {
            expect(inspEvent.event).toEqual({ type: 'FILTER_RESET', filterParamsKeys: [URL_KEY] })
            done('')
          }
        }
      }
    })

    actor.start()

    actor.getSnapshot().children.filterTestMachine?.send({ type: 'SET_FILTER', payload: null })
  }))
})
