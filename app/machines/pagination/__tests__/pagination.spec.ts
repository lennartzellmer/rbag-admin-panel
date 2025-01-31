import { beforeEach, describe, expect, it } from 'vitest'
import { createActor, createMachine } from 'xstate'
import { paginationMachine } from '../pagination.machine.js'

describe('paginationMachine', () => {
  beforeEach(() => {
    global.window = Object.create(window)
    const url = new URL('https://www.example.com')
    url.searchParams.set('limit', '10')
    url.searchParams.set('offset', '0')
    Object.defineProperty(window, 'location', {
      value: url
    })
  })

  it('stores initial input and calculates current page and awaits totalCount', () => new Promise((done) => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1 })
    expect(actor.getSnapshot().value).toEqual('awaitingTotalCount')
    done('')
  }))

  it('sets totalCount and calculates totalPages and goes to idle', () => new Promise((done) => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
    done('')
  }))

  it('increments page and informs parent on next page', () => new Promise((done) => {
    let receivedEvent = null
    const parent = createActor(createMachine({ id: 'parent' }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event' && inspectionEvent.event.type === 'PAGE_UPDATED')
          receivedEvent = inspectionEvent.event
      }
    })
    const actor = createActor(paginationMachine, { parent }).start()

    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'NEXT_PAGE' })
    expect(receivedEvent!.type).toEqual('PAGE_UPDATED')
    expect(receivedEvent!.pagination.offset).toEqual(10)
    expect(receivedEvent!.pagination.limit).toEqual(10)
    done('')
  }))

  it('decrements page and informs parent on prev page', () => new Promise((done) => {
    let receivedEvent = null
    const parent = createActor(createMachine({ id: 'parent' }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event' && inspectionEvent.event.type === 'PAGE_UPDATED')
          receivedEvent = inspectionEvent.event
      }
    })
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'NEXT_PAGE' })
    actor.send({ type: 'PREV_PAGE' })
    expect(receivedEvent!.type).toEqual('PAGE_UPDATED')
    expect(receivedEvent!.pagination.offset).toEqual(0)
    expect(receivedEvent!.pagination.limit).toEqual(10)
    done('')
  }))

  it('handles go to target page', () => new Promise((done) => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'GO_TO_TARGET_PAGE', targetPage: 5 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 40, currentPage: 5, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
    done('')
  }))

  it('does not go to target page if it is out of bounds', () => new Promise((done) => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'GO_TO_TARGET_PAGE', targetPage: 100 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
    done('')
  }))

  it('goes to first page if update total count is called with lower value than current page allows', () => new Promise((done) => {
    let receivedEvent = null
    const parent = createActor(createMachine({ id: 'parent' }), {
      inspect(inspectionEvent) {
        if (inspectionEvent.type === '@xstate.event' && inspectionEvent.event.type === 'PAGE_UPDATED')
          receivedEvent = inspectionEvent.event
      }
    })
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 30 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1, totalCount: 30, totalPages: 3 })
    expect(actor.getSnapshot().value).toEqual('idle')
    expect(receivedEvent!.type).toEqual('PAGE_UPDATED')
    expect(receivedEvent!.pagination.offset).toEqual(0)
    expect(receivedEvent!.pagination.limit).toEqual(10)
    done('')
  }))
})
