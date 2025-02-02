import { assign, fromPromise, setup, assertEvent } from 'xstate'
import { patchUser } from '../../services/api'
import type { UserDocument } from '~~/server/models/User'

export const userEditorMachine = setup({
  types: {
    context: {} as {
      user: UserDocument
    },
    input: {} as {
      user: UserDocument
    },
    events: {} as {
      type: 'UPDATE_USER'
      payload: {
        user: Partial<UserDocument>
      }
    } | {
      type: 'SAVE_USER'
    }
  },
  actions: {
    assignUserWithPartial: assign({
      user: ({ context, event }) => {
        assertEvent(event, 'UPDATE_USER')
        return Object.assign({}, context.user, event.payload.user)
      }
    })
  },
  actors: {
    patchUser: fromPromise(async ({ input }: { input: UserDocument }) => await patchUser(input))
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FEIEsAuA9ugHQ4QA2YAxAKoAKAIgIIAqmA+jQMqYBKA2gAYAuolAAHArHw4CAOzEgAHogAsATgAcxLaoDMAVj2DNB9QDYAjOoA0IAJ6IAtJr3EDHvZYDsmrec1VA1UAXxC7VAxsfCJiSBk5KCouJgA1Dm4+IVEkEElpPFkFXJUEACZ1b2JBdUM9SsEDMss9VXM7RwRLQVUddX7NUwDVb29rMIi0LFxCElgAQwA3HESqCHkwUjlFggBrTcjpmLmllagEFZ2AY3nC+WzsxXyZeUVS829BYhGDb36K0zqNodRCudxlVplVSaXyuQyWMLhEByAgQOCKQ7RWZPKQvYqgUotMrEKF6cwWYKfVQ+VQghBOHyWaqeGrQ4x-XwTECYmaxMiUHEFIpvUFjYjkpqaKzGD7tByIbq9fr9UZtIyuTQIpE845xGZnQV4kVdTRfUnk8yUno0umKvrKixjX6Ccx6Lk62bEBbLRKGu745RqD7VU1tD5lDwR7wGOma74OywGQL1JoGREhIA */
  id: 'userEditor',

  initial: 'idle',

  context: ({ input }) => ({
    user: input.user
  }),

  states: {
    idle: {
      on: {
        UPDATE_USER: {
          target: 'editing',
          actions: ['assignUserWithPartial'],
          reenter: true
        }
      }
    },
    editing: {
      on: {
        SAVE_USER: {
          target: 'saving'
        }
      }
    },
    saving: {
      invoke: {
        src: 'patchUser',
        input: ({ context }) => context.user,
        onDone: {
          target: 'idle',
          actions: assign({
            user: ({ event }) => event.output
          })
        }
      }
    }
  }
})
