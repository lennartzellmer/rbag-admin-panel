import { createMachine, setup } from 'xstate'

export const genericPaginatedDataMachineSetup = setup({
  actions: {
    spawnPaginationActor: () => {
      console.log('spawnPaginationActor')
    },
    spawnFilterMachines: () => {
      console.log('spawnFilterMachines')
    }
  }
})

export const genericPaginatedDataMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QwHZgE4EsDGAFAhlJivgC6QAiZ+AdJhADZgDEAYgKIAqAwgBIDaABgC6iUAAcA9rEylMklGJAAPRAEYATAFYaATn26AHBoDMG01s26ANCACeiXRppatg92oAsZp8YDsAL4BtqgYOAREJOQQVKS0DJL4EMRQbFx8APoAygCq3NzsWVlCokggUjJyCkqqCCYAbLounvWGnn6Clmqttg4Ips4Gun4mgvWCfmpqukEhYGhYeITEZJTUNAlJKWk8vBnsAEoHAPIHJUoVsvKKZbUNTVotbR1dPfbqJmp6QxpjXpa6eqzEChRYRFbRWK0WAAV2w2DgsB2fHOZUuVRuoFqnk8TTUWnqvzMhnqDWmvXUxhouP0xgJakEhmmnmBoPCyyiaziNAw6Ek6GRAhEF2kV2qt0QOLxBKJGhJZJs7wQTJc7g89OM0xmwJQkggcCUbKWkVWMWoIsq1xqiAAtPUKQg7az5mFjRCubR6EwLWLMSpJRoHboTDRBDTAYZhgT6t1nQt2SbIetNskUFAfRjrf0TH4aH4maYGpZBA0gyGwwZWlH6jGTHHXeDOWbubD4YiM1aJQgCYI9DnPI8Y24WvaldMvoyTJ9NIY-DjXPWwRzTVCeeg+egO+KsYge3254P8WGa0He5Op4I5UzDK4gUEAkA */
  id: 'genericPaginatedData',
  initial: 'waitForInitialFilter',
  context: {
    data: [],
    pagination: {
      offset: 0,
      limit: 10
    },
    total: 0,
    filter: {}
  },
  entry: ['spawnPaginationActor', 'spawnFilterMachines'],
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        FETCH_SUCCESS: 'success',
        FETCH_ERROR: 'error'
      }
    },
    success: {
      on: {
        FETCH: 'loading'
      }
    },
    error: {
      on: {
        FETCH: 'loading'
      }
    }
  }
})
