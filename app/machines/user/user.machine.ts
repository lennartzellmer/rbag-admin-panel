import { createMachine, setup } from 'xstate'
import { showToast } from '../actions/toast'

export const userMachine = setup({
  types: {
    context: {} as {
      userId: ''
    },
    events: {} as { type: 'setRoles' }
  },
  actions: {
    showToast
  },
  actors: {
    setUserRoles: createMachine({
      /* ... */
    }),
    fetchUserRoles: createMachine({
      /* ... */
    })
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FkCGBjAFgJYB2YAdIRADZgDEaALgEoD2NsA2gAwC6ioABxaxCDQi2L8QAD0QAmAMwA2MgEYA7AA51XTV1UBOdaq7r1AGhABPeXLlkArEqW65Bl+7maAvt8uoMHAIScmxYEShiEihWdloICXISADcWAGtyAKw8IlIyMIio4hi2OAQUllxsMQluHjqpIREaySQZRAcFVTIAFiVVfoGehU1VTQVLGwQAWk17VQdDLU7NQfUFX380bOC8gsJI6Ni4Wgx0FnQyASpqgDMLgFsyLKDc0PCDopL2cuJUqpadQabSaonErVAsgQci4BjISh6qh67kWTg0zkmiC6cPUcnUPXWWjkqi6PU2IBeORCZFuYAYu2+JwSeQqGWe21e1Np9NyjNgv3+1XBQN4jWEYIkUih0y6ZDxZi4DjxqmJSkUPUxCAMcI0GgJBPUBgGo3JlN25G5DOOsFO6HOl2ud0e7MCVLylt51oFlSFtV4wME4paUsQ0zkiLI6mcSiVowcywME2siCjvQJSJGqyUCjkvj8IGILAgcCkZreYua4JDMy8OOjsYWCaUmumAzh+s0Ru0iwMpiUpo5bqS1DAFYlEPa0IckajCgUDlhqzkMebyehdjlCh6it1au3OYHrvN+Q+h2K1rHwbaUMW6nhXFhA10owM8c1hk0ZBfc67ciVc8PHY3hpOkrVKeAQSDKtr1DBQuEjFVFAWBw4y6BwWy0eFtVhWEPC4BEDDzbwgA */
  context: {
    userId: ''
  },
  id: 'userMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        setRoles: {
          target: 'assigningRoles'
        }
      }
    },

    assigningRoles: {
      invoke: {
        src: 'setUserRoles',
        input: {},
        onDone: {
          target: 'fetchingRoles',
          actions: {
            type: 'showToast',
            params: {
              title: 'Rollen erfolgreich festgelegt',
              description: 'Die rollen wurden erfolgreich hinzugefügt',
              color: 'primary',
              icon: 'i-lucide-check-circle'
            }
          },
          reenter: true
        },
        onError: {
          target: 'idle',
          actions: {
            type: 'showToast',
            params: {
              title: 'Fehler bei Rollenzuweisung',
              description: 'Die Rollen konnten nicht erstellt werden',
              color: 'error',
              icon: 'i-lucide-alert-circle'
            }
          }
        }
      }
    },
    fetchingRoles: {
      invoke: {
        src: 'fetchUserRoles',
        input: {},
        onDone: 'idle',
        onError: {
          target: 'idle',
          actions: {
            type: 'showToast',
            params: {
              title: 'Fehler beim Laden der Rollen',
              description: 'Die Rollen konnten nicht geladen werden',
              color: 'error',
              icon: 'i-lucide-alert-circle'
            }
          }
        }
      }
    }
  }
})
