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
      type: 'SAVE_USER'
      payload: {
        user: Partial<UserDocument>
      }
    }
  },
  actions: {
    assignUserWithPartial: assign({
      user: ({ context, event }) => {
        assertEvent(event, 'SAVE_USER')
        return Object.assign({}, context.user, event.payload.user)
      }
    })
  },
  actors: {
    patchUser: fromPromise(async ({ input }: { input: UserDocument }) => await patchUser(input._id, input))
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FEIEsAuA9ugHST44B2UAxAMoCCAapgPoCqtmASgNoAMAXUSgADgVjkCFYSAAeiAIwA2AMzEAHEtV8ALAt0BWAEzqDBgDQgAnoiNG1SowHZ1Lp0oCcdr0oC+vy1QMbHwiYlgAQwA3ShoIKTBiSiiCAGtEoKxcQhJImKoEZIIAYwi8HCl+ASqZMQlyqRl5BGUdYg8+IwUFIyUDJx1+gyVLGwQAWhUlduGVAz4nFQ8Ooz45-wCQCgIIOBlMkJza8UlpJDlEcZHrS562wdUdDoUPV1WDf0C0LNCSMnKqMd6hUzqBmjojKNFHwPMQ+AZXup1DoVL11B51psDtkwnlYkDTk1EHNYciVO4nvpBktrmMPAYNBi7PD1CpWaiNr4gA */
  id: 'userEditor',

  initial: 'editing',

  context: ({ input }) => ({
    user: input.user
  }),

  states: {
    editing: {
      on: {
        SAVE_USER: {
          target: 'saving',
          actions: ['assignUserWithPartial']
        }
      }
    },
    saving: {
      invoke: {
        src: 'patchUser',
        input: ({ context }) => context.user,
        onDone: {
          target: 'editing',
          actions: assign({
            user: ({ event }) => event.output
          })
        }
      }
    }
  }
})
