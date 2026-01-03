import { assertEvent, assign, fromPromise, setup, type ErrorActorEvent } from 'xstate'
import { showToast } from '../actions/toast'
import { setUserRoles } from '~/service/user'

export const userRolesMachine = setup({
  types: {
    context: {} as {
      userId: string
      storedRoles: string[]
      localRoles: string[]
    },
    events: {} as { type: 'setRoles', roles: string[] },
    input: {} as {
      userId: string
      storedRoles: string[]
    }
  },
  actions: {
    showToast,
    assignLocalRoles: assign(({ event, context }) => {
      assertEvent(event, 'setRoles')
      return {
        ...context,
        localRoles: event.roles
      }
    }),
    resetRoles: assign({
      localRoles: ({ context }) => context.storedRoles
    }),
    assignLocalToStoredRoles: assign({
      storedRoles: ({ context }) => context.localRoles
    })
  },
  actors: {
    setUserRoles: fromPromise<undefined, { userId: string, roles: string[] }>(
      async ({ input }) => {
        await setUserRoles(input.userId, input.roles)
        return
      }
    )
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FkCGBjAFgJYB2YAdIRADZgDEaALgEoD2NsA2gAwC6ioABxaxCDQi2L8QAD0QAmLgA4yATgCscgIxr1AZjkbdutQBoQAT0SaVKsooAsm+wDYuurup3OAvt7OoMHAIScmxYEShiEihWdloICXISADcWAGtyAKw8IlIyMIio4hi2OAQUllxsMQluHjqpIREaySQZeTcyNQB2bsUtZzk5FS0DM0sEVzIuPodneyMFe0VffzRs4LyCwkjo2LhaDHQWdDIBKmqAMxOAWzIsoNzQ8J2ikvZy4lSqlrqGtqaonErVAsgQCls8ycKmcam0zk03WcznGiF01jI3Tk3Xs3V0fS06Psvj8IGILAgcCkDxyIUawiBEikYIAtEMyENdMj7CouJp8bp7PZUQg2d0OUKuM4HMtsd0Zj5STTNklqGB6c1gcz5GpMUijGoPIpBrCURZ5Oy5IKuHDuppBvY3HJViBlU98i9dsV9vAAQyWtqELayK4PPalIprD0RdZlJGVEYVJp+oZdCTvEA */
  context: ({ input }) => ({
    userId: input.userId,
    storedRoles: input.storedRoles,
    localRoles: input.storedRoles
  }),
  id: 'userMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        setRoles: {
          target: 'assigningRoles',
          actions: 'assignLocalRoles'
        }
      }
    },
    assigningRoles: {
      invoke: {
        src: 'setUserRoles',
        input: ({ context }) => ({
          userId: context.userId,
          roles: context.localRoles
        }),
        onError: {
          target: 'idle',
          actions: [{
            type: 'showToast',
            params: ({ event }) => {
              const err = event as ErrorActorEvent<{ data: { statusCode: number } }, 'setUserRoles'>
              if (err.error.data.statusCode === 409) {
                return {
                  title: 'Diese Rolle kann nicht entfernt werden',
                  description: 'Es muss mindestens ein Admin-Nutzer existieren.',
                  color: 'error',
                  icon: 'i-lucide-alert-circle'
                }
              }
              return {
                title: 'Fehler bei Rollenzuweisung',
                description: 'Die Rollen konnten nicht erstellt werden',
                color: 'error',
                icon: 'i-lucide-alert-circle'
              }
            }
          },
          'resetRoles'
          ]
        },
        onDone: {
          target: 'idle',
          actions: [{
            type: 'showToast',
            params: {
              title: 'Rollen erfolgreich festgelegt',
              description: 'Die rollen wurden erfolgreich hinzugefügt',
              color: 'success',
              icon: 'i-lucide-check-circle'
            }
          },
          'assignLocalToStoredRoles'
          ],
          reenter: true
        }
      }
    }
  }
})
