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

  it('sets the user in the context and goes to editing', async () => {
    const actor = createActor(userEditorMachine, { input: { user: mockUser } }).start()
    expect(actor.getSnapshot().context.user).toEqual(mockUser)
    expect(actor.getSnapshot().value).toEqual('editing')
  })

  it('saves the user on SAVE_USER event', async () => {
    const machine = userEditorMachine.provide({
      actors: { patchUser: fromPromise(async ({ input }) => await patchUser(input._id, input)) }
    })
    const actor = createActor(machine, { input: { user: mockUser } }).start()
    actor.send({ type: 'SAVE_USER', payload: { user: {
      firstname: 'Jane'
    } } })
    expect(actor.getSnapshot().value).toEqual('saving')
    const state = await waitFor(actor, ({ value }) => value === 'editing')
    expect(state.value).toEqual('editing')
    expect(state.context.user).toEqual(changedUser)
    expect(patchUser).toHaveBeenCalledOnce()
  })
})
