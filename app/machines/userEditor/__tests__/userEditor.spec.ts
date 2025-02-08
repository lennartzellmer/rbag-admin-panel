import { describe, expect, it, vi } from 'vitest'
import { createActor, fromPromise, waitFor } from 'xstate'
import { User } from '../../../../server/models/User'
import { userEditorMachine } from '../userEditor.machine'

describe('test', () => {
  const mockUser = new User({
    _id: '123',
    email: 'test@test.com',
    cognitoId: '123',
    createdAt: new Date('2025-01-01'),
    firstname: 'John',
    lastname: 'Doe',
    lastModifiedAt: new Date('2025-01-01'),
    _class: 'spring.user.User',
    organisationId: '123'
  }).toObject()

  const changedUser = { ...mockUser, firstname: 'Jane' }

  const patchUser = vi.fn().mockResolvedValue(changedUser)
  const patchUserFails = vi.fn().mockRejectedValue(changedUser)

  it('sets the user in the context and goes to editing', async () => {
    const actor = createActor(userEditorMachine, { input: { user: mockUser } }).start()
    expect(actor.getSnapshot().context.user).toEqual(mockUser)
    expect(actor.getSnapshot().value).toEqual({ idle: 'waiting' })
  })

  it('saves the user on SAVE_USER event', async () => {
    const machine = userEditorMachine.provide({
      actions: {
        onSaved: () => {}
      },
      actors: { patchUser: fromPromise(async ({ input }) => await patchUser(input._id, input)) }
    })
    const actor = createActor(machine, { input: { user: mockUser } }).start()
    actor.send({ type: 'TOUCH' })
    actor.send({ type: 'SAVE_USER', payload: { user: {
      firstname: 'Jane'
    } } })
    expect(actor.getSnapshot().context.user).toEqual(changedUser)
    expect(actor.getSnapshot().value).toEqual('saving')
    const state = await waitFor(actor, state => state.matches({ idle: 'waiting' }))
    expect(state.value).toEqual({ idle: 'waiting' })
    expect(state.context.user).toEqual(changedUser)
    expect(patchUser).toHaveBeenCalledOnce()
  })

  it('calls the onSaved action when the user is saved', async () => {
    const onSaved = vi.fn()
    const machine = userEditorMachine.provide({
      actions: {
        onSaved: onSaved
      },
      actors: { patchUser: fromPromise(async ({ input }) => await patchUser(input._id, input)) }
    })
    const actor = createActor(machine, { input: { user: mockUser } }).start()
    actor.send({ type: 'TOUCH' })
    actor.send({ type: 'SAVE_USER', payload: { user: {
      firstname: 'Jane'
    } } })
    expect(actor.getSnapshot().context.user).toEqual(changedUser)
    await waitFor(actor, state => state.matches({ idle: 'waiting' }))
    expect(onSaved).toHaveBeenCalledOnce()
  })

  it('goes to error state when the user is not saved', async () => {
    const machine = userEditorMachine.provide({
      actors: { patchUser: fromPromise(async ({ input }) => await patchUserFails(input._id, input)) }
    })
    const actor = createActor(machine, { input: { user: mockUser } }).start()
    actor.send({ type: 'TOUCH' })
    actor.send({ type: 'SAVE_USER', payload: { user: {
      firstname: 'Jane'
    } } })
    await waitFor(actor, state => state.matches({ idle: 'error' }))
    expect(actor.getSnapshot().value).toEqual({ idle: 'error' })
  })
})
