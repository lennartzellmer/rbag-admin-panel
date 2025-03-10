import { getMongoDBEventStore } from '@event-driven-io/emmett-mongodb'

const connectionString = process.env.NUXT_MONGODB_EVENT_STORE_URI

if (!connectionString) {
  throw new Error('Missing required environment variable NUXT_MONGODB_EVENT_STORE_URI')
}

// Create a singleton instance of the MongoDB event store
export const mongoEventStoreSingleton = getMongoDBEventStore({
  connectionString
})

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    eventStore: typeof mongoEventStoreSingleton
  }
}

// Extend the NitroApp context interface to include the eventStore singleton
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    event.context.eventStore = mongoEventStoreSingleton
  })
})
