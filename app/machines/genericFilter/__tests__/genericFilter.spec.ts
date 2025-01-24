import { describe, expect, it } from 'vitest'
import { createMachine, interpret } from 'xstate'
import { createFilterMachine } from '../genericFilter.machine'

const URL_KEY = 'foo'
const TEST_VALUE = 'firstEvent'

const filterTestMachine = createFilterMachine({
  filterUrlKey: URL_KEY,
  filterParamsKeys: [URL_KEY],
  filterValueGetter: () => ({ [URL_KEY]: TEST_VALUE }),
})

describe('filterMachineStoresInternally', () => {
  const parentMachine = createMachine({
    predictableActionArguments: true,
    invoke: {
      src: filterTestMachine,
      id: 'filterTestMachine',
    },
  })

  it('stores initial filter value internally on creation', () => new Promise((done) => {
    const service = interpret(parentMachine)

    service.start()

    service.children.get('filterTestMachine')?.subscribe((state) => {
      expect(state.context.filterValue).toStrictEqual({ [URL_KEY]: TEST_VALUE })
      done('')
    })
  }))

  it('update stored filter on SET_FILTER', () => new Promise((done) => {
    const UPDATED_VALUE = 'updatedValue'

    const service = interpret(parentMachine)

    service.start()

    service.children.get('filterTestMachine')?.subscribe((state) => {
      if (state.event.type === 'SET_FILTER') {
        expect(state.context.filterValue).toStrictEqual({ [URL_KEY]: UPDATED_VALUE })
        done('')
      }
    })

    service.children.get('filterTestMachine')?.send({ type: 'SET_FILTER', payload: { [URL_KEY]: UPDATED_VALUE } })
  }))
})

describe('filterMachineCommunicatesToParent', () => {
  it('sends FILTER_UPDATED event to parent on creation', () => new Promise((done) => {
    let eventReceived = false

    const parentMachine = createMachine({
      id: 'test',
      initial: 'awaitingInitial',
      predictableActionArguments: true,
      invoke: {
        src: filterTestMachine,
      },
      states: {
        awaitingInitial: {
          on: {
            FILTER_UPDATED: {
              actions: () => {
                eventReceived = true
              },
            },
          },
        },
      },
    })

    const service = interpret(parentMachine).onTransition((state) => {
      if (state.event.type === 'FILTER_UPDATED') {
        expect(eventReceived).toBeTruthy()
        done('')
      }
    })

    service.start()
  }))

  it('sends FILTER_UPDATED event to parent when filter is updated', () => new Promise((done) => {
    let eventReceived = false

    const parentMachine = createMachine({
      id: 'test',
      initial: 'awaitingInitial',
      predictableActionArguments: true,
      invoke: {
        src: filterTestMachine,
        id: 'filterTestMachine',
      },
      states: {
        awaitingInitial: {
          on: {
            FILTER_UPDATED: 'idle',
          },
        },
        idle: {
          on: {
            FILTER_UPDATED: {
              internal: true,
              actions: () => {
                eventReceived = true
              },
            },
          },
        },
      },
    })

    const service = interpret(parentMachine).onTransition((state) => {
      if (state._event.data.filter?.foo === 'secondEvent') {
        expect(eventReceived).toBeTruthy()
        done('')
      }
    })

    service.start()

    service.children.get('filterTestMachine')?.send({ type: 'SET_FILTER', payload: { [URL_KEY]: 'secondEvent' } })
  }))

  it('sends FILTER_RESET event to parent when filter is removed', () => new Promise((done) => {
    const parentMachine = createMachine({
      id: 'test',
      initial: 'awaitingInitial',
      predictableActionArguments: true,
      invoke: {
        src: filterTestMachine,
        id: 'filterTestMachine',
      },
      states: {
        awaitingInitial: {
          on: {
            FILTER_RESET: 'idle',
          },
        },
        idle: {},
      },
    })

    const service = interpret(parentMachine).onTransition((state) => {
      if (state._event.data.type === 'FILTER_RESET') {
        expect(state._event.data).toStrictEqual({ type: 'FILTER_RESET', filterParamsKeys: [URL_KEY] })
        done('Event received')
      }
    })

    service.start()

    service.children.get('filterTestMachine')?.send({ type: 'SET_FILTER', payload: null })
  }))
})
