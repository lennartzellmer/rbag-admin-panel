import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { createActor, createMachine, waitFor } from 'xstate'
import { paginationMachine } from '../pagination.machine.js'
import { mockWindowHistory, mockWindowLocation, restoreWindowHistory, restoreWindowLocation } from './mockWindowLocation'

describe('paginationMachine', () => {
  beforeEach(() => {
    mockWindowLocation('http://localhost:3000?limit=10&offset=0')
    mockWindowHistory()
  })

  afterEach(() => {
    restoreWindowLocation()
    restoreWindowHistory()
  })

  it('stores initial input and calculates current page and awaits totalCount', async () => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1 })
    expect(actor.getSnapshot().value).toEqual('awaitingTotalCount')
  })

  it('sets totalCount and calculates totalPages and goes to idle', async () => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
  })

  it('handles go to target page', async () => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    await waitFor(actor, state => state.matches('idle'))
    actor.send({ type: 'GO_TO_TARGET_PAGE', targetPage: 5 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 40, currentPage: 5, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
  })

  it('does not go to target page if it is out of bounds', async () => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'GO_TO_TARGET_PAGE', targetPage: 100 })
    expect(actor.getSnapshot().context).toEqual({ limit: 10, offset: 0, currentPage: 1, totalCount: 100, totalPages: 10 })
    expect(actor.getSnapshot().value).toEqual('idle')
  })

  it('goes to first page if update total count is called with lower value than current page allows', async () => {
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
  })

  it('stores updated offset and limit in URL', async () => {
    const parent = createActor(createMachine({ id: 'parent' }))
    const actor = createActor(paginationMachine, { parent }).start()
    actor.send({ type: 'UPDATE_TOTAL_COUNT', totalCount: 100 })
    actor.send({ type: 'GO_TO_TARGET_PAGE', targetPage: 2 })
    expect(window.location.search).toEqual('?limit=10&offset=10')
  })
})
