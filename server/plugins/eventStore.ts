import { createEventStore } from 'vorfall'
import { veranstaltungKategorieProjectionDefinition } from '../domain/veranstaltungsKategorie/eventHandling'
import { veranstaltungProjectionDefinition } from '../domain/veranstaltung/eventHandling'
import { userProjectionDefinition } from '../domain/user/eventHandling'
import { mediaProjectionDefinition } from '../domain/media/eventHandling'

const runtimeConfig = useRuntimeConfig()

const connectionString = runtimeConfig.mongodb.connectionString

if (!connectionString) {
  throw new Error('Missing required environment variable NUXT_MONGODB_CONNECTION_STRING')
}

// Create a singleton instance of the MongoDB event store
export const eventStoreSingleton = createEventStore({
  connectionString,
  projections: [
    veranstaltungKategorieProjectionDefinition,
    veranstaltungProjectionDefinition,
    userProjectionDefinition,
    mediaProjectionDefinition
  ]
})

export type RbagEventStoreInstance = typeof eventStoreSingleton

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    eventStore: RbagEventStoreInstance
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
