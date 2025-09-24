import { createEventStore } from 'vorfall'
import { veranstaltungKategorieProjectionDefinition } from '../domain/veranstaltungsKategorie/eventHandling'
import { veranstaltungProjectionDefinition } from '../domain/veranstaltung/eventHandling'
import { userProjectionDefinition } from '../domain/user/eventHandling'

const connectionString = process.env.NUXT_MONGODB_EVENT_STORE_URI

if (!connectionString) {
  throw new Error('Missing required environment variable NUXT_MONGODB_EVENT_STORE_URI')
}

// Create a singleton instance of the MongoDB event store
export const eventStoreSingleton = createEventStore({
  connectionString,
  projections: [
    veranstaltungKategorieProjectionDefinition,
    veranstaltungProjectionDefinition,
    userProjectionDefinition
  ]
})

export type RbagEventStoreInstance = typeof eventStoreSingleton

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    eventStore: RbagEventStoreInstance
    user: {
      id: string
      roles: string[]
      email: string
    }
  }
}

// Add the event store to the request event context
// This way, the event store is available in all request handlers
// like this: const eventStore = event.context.eventStore
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    event.context.eventStore = eventStoreSingleton
  })
})
