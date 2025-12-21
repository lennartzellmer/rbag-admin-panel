import { setup, type ActorRefFrom } from 'xstate'
import { categoryUpdateMachine } from './categoryUpdate.machine'
import { categoryCreateMachine } from './categoryCreate.machine'
import { showToast } from '../actions/toast'
import { createFetchPaginatedMachine } from '../fetchPaginated/fetchPaginated.machine'
import { getVeranstaltungsKategorienPaginated } from '~/service/veranstaltung-kategorie'

type SpawnedCategoryCreateMachine = ActorRefFrom<typeof categoryCreateMachine>
type SpawnedCategoryUpdateMachine = ActorRefFrom<typeof categoryUpdateMachine>

export const categoryMachine = setup({
  types: {
    events: {} as
    | { type: 'EDIT', categoryId: string }
    | { type: 'CREATE' },
    context: {} as {
      categoryCreateActorRef?: SpawnedCategoryCreateMachine
      categoryUpdateActorRef?: SpawnedCategoryUpdateMachine
    }
  },
  actions: {
    showToast
  },
  actors: {
    categoryUpdateMachine,
    categoryCreateMachine,
    fetchPaginatedMachine: createFetchPaginatedMachine({
      fetchDataFunction: getVeranstaltungsKategorienPaginated
    })
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAXMUD2AnAngLKrIAWAlgHZgB0sp2A7gMIZZ7lwDEAogCIBJACoBtAAwBdRKAAO2WOXTlslaSAAeiAEwBmAKw0ALGICMAdgBsh4yYCcYswBoQ+bYa01bADgs6tWizM9MQDbAF8w5zRMHAJiMipaeiZWGI5uZgAlHgBBIR5xKSQQOQUlFTVNBH8dGhMTHX0TCwsxQxM9LWdXBC8TGjExHTMvYYDje0MIqLZYohIKahpIRVT2Ai4IFST0Nhpo9fmEpZX0NbnCtVLFZVViqrNavTMtPRN3W0M-LScXRH1ag4tA4xD4OiZdNMQAc5vFFrRkLgwGxznh8JttnRdph9rM0XDEvskSi8QRLsVruU7qAqg1DJ4QoMzBDRrYzF9uogALQdIwjSw6ExeQxssxiiKRECUbAQOBqGH4haJK7yG4Ve7ciw0AKmQIWEwOeoOWychA8kI0LymMxDLR0sR6dxQhVxJVLZIsUmceAU1VUyqIdo0R7ePw6Ly2LReCNdP4IZoGQW6UEddoBMzO0lHeHLCCrLMqsq3AMIHStGidHzBSwvQVePSmuxa0Zaex+R6tn4mTNpV3HBHEzCogiFtXUjT-CweTrtB0-eymQwNuNWmh+IWdIIvNreCVhIA */
  context: {},
  id: 'categoryMachine',
  initial: 'showCategories',
  states: {
    showCategories: {
      invoke: {
        src: 'fetchPaginatedMachine',
        id: 'fetchPaginatedMachine'
      },
      on: {
        EDIT: {
          target: 'editCategory'
        },
        CREATE: {
          target: 'createCategory'
        }
      }
    },
    editCategory: {
      invoke: {
        src: 'categoryUpdateMachine',
        id: 'categoryUpdateMachine',
        onDone: {
          target: 'showCategories'
        }
      }
    },
    createCategory: {
      invoke: {
        src: 'categoryCreateMachine',
        id: 'categoryCreateMachine',
        onDone: {
          target: 'showCategories'
        }
      }
    }
  }
})
