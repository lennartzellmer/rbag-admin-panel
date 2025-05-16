import { createMongoDBSingleton } from '../eventStore/mongoDbStorage'

const connectionString = process.env.NUXT_MONGODB_EVENT_STORE_URI
const databaseName = process.env.NUXT_MONGODB_EVENT_STORE_DATABASE_NAME

if (!connectionString) {
  throw new Error('Missing required environment variable NUXT_MONGODB_EVENT_STORE_URI')
}

if (!databaseName) {
  throw new Error('Missing required environment variable NUXT_MONGODB_EVENT_STORE_DATABASE_NAME')
}

// Create a singleton instance of the MongoDB event store
export const mongoEventStoreSingleton = createMongoDBSingleton({ uri: connectionString, dbName: databaseName })

// Extend the H3EventContext interface to include the eventStore property
declare module 'h3' {
  interface H3EventContext {
    eventStore: typeof mongoEventStoreSingleton
  }
}

// Add the event store to the request event context
// This way, the event store is available in all request handlers
// like this: const eventStore = event.context.eventStore
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    event.context.eventStore = mongoEventStoreSingleton
  })
})
