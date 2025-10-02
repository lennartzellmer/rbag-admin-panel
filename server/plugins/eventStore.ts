import { createEventStore } from 'vorfall'
import { veranstaltungKategorieProjectionDefinition } from '../domain/veranstaltungsKategorie/eventHandling'
import { veranstaltungProjectionDefinition } from '../domain/veranstaltung/eventHandling'
import { userProjectionDefinition } from '../domain/user/eventHandling'
import { mediaProjectionDefinition } from '../domain/media/eventHandling'

const runtimeConfig = useRuntimeConfig()

const url = runtimeConfig.mongodb.eventStoreUri
const user = runtimeConfig.mongodb.user
const password = runtimeConfig.mongodb.password

if (!user || !password || !url) {
  throw new Error('Missing required environment variable NUXT_MONGODB_USER, NUXT_MONGODB_PASSWORD, or NUXT_MONGODB_EVENT_STORE_URI')
}

const connectionString = `mongodb://${user}:${password}@${url}`

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
