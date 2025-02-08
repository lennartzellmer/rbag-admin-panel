import { assign, fromPromise, setup } from 'xstate'
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
    } | {
      type: 'TOUCH'
    } | {
      type: 'RETRY'
    }
  },
  actions: {
    assignUserWithPartial: assign({
      user: ({ context }, params: { user: Partial<UserDocument> }) => {
        return Object.assign({}, context.user, params.user)
      }
    }),
    onSaved: (_, _params: { user: UserDocument }) => {
      console.log('onSaved called')
    },
    onError: () => {
      console.log('onError called')
    }
  },
  actors: {
    patchUser: fromPromise(async ({ input }: { input: UserDocument }) => await patchUser(input._id, input))
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FEIEsAuA9ugHQ4QA2YxA7gIb44B2UAxACoDyAqgMIASAbQAMAXUSgADgVgMCjcSAAeiAGxCAnMQAcAZgCMenUJVaTegCw6ANCACeiPeq3EATEP16Xnve4Cs5lwBfQJtUDGx8IlIKKkJkAGMAC0gWAGUAQQA1TAB9LlTMACVhMSQQKRk8HDkFZQRfLSFiAHYhAK1zZp1-ZpcbewQAWgNNc3VHFxVzTrHzFR1g0LQsXEISWFoANyZWCDkqJk2CAGsqMJXI9a2dhEOCeNoquRKShQrZeTK6vUbiSydJp0tI0jOZ+og3M0Ws0Ol4hHoVC5LDoFiEQOcImtiBttswWBh0FEJORHgAzIgAW2IGNWURxNzuDyejBeoje0g+tQcTmIKhhPl8egavRU4IQKPMrncnl0wMmOi0i3Ry0xUTIlGIBKI7G4-FeZXezK5CDUml0BiEzV86iELl8Oj6dkQKJcLWlSKE8J86jtSppl2iGq16BYhUwbEKAE19ZIOUavhCXM4tJN-DaXepfA0xXM9MQnFb9EJGloGupgmjGAQIHAFP61uzKtVPqA6oMbdofZb5lMdM1mipRU6hm4VPnxj7mj4XC4Hb4-SraSR1WBG5yEwhpq7muoTFaxRa3UZ+x0GoZ52j62qYjR6FVmGv463EGMmju974Dzy3PpfZfFwGK7EHESSQI+zbGl0ox2uYgoWMCCLWMOjjOD+BheHC3QBAu4RLoGVDBuBNQbq+LS7lo+7Di6R7wfani2u4OEXFi9IPgacYQRugwBJ2kI9pY-aDge8K8vCWYzl0ej9noFaBEAA */
  id: 'userEditor',
  initial: 'idle',
  context: ({ input }) => ({
    user: input.user
  }),
  states: {
    idle: {
      states: {
        waiting: {
          on: {
            TOUCH: 'touched'
          }
        },
        touched: {
          on: {
            SAVE_USER: {
              target: '#userEditor.saving',
              actions: [{
                type: 'assignUserWithPartial',
                params: ({ event }) => ({ user: event.payload.user })
              }],
              reenter: true
            }
          }
        },
        error: {
          on: {
            TOUCH: 'touched',
            RETRY: '#userEditor.saving'
          }
        }
      },
      initial: 'waiting'
    },
    saving: {
      invoke: {
        src: 'patchUser',
        input: ({ context }) => context.user,
        onDone: {
          target: 'idle',
          actions: [
            {
              type: 'onSaved',
              params: ({ event }) => ({ user: event.output })
            },
            {
              type: 'assignUserWithPartial',
              params: ({ event }) => ({ user: event.output })
            }
          ]
        },
        onError: {
          target: 'idle.error',
          actions: [
            {
              type: 'onError'
            }
          ]
        }
      }
    }
  }
})
