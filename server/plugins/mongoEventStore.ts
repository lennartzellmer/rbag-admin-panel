import { projections } from '@event-driven-io/emmett'
import { getMongoDBEventStore } from '@event-driven-io/emmett-mongodb'
import { rbagEventProjection } from '../eventDriven/rbagEvents'
import { rbagEventCategoryProjection } from '../eventDriven/rbagEventCategories'

const connectionString = process.env.NUXT_MONGODB_EVENT_STORE_URI

if (!connectionString) {
  throw new Error('Missing required environment variable NUXT_MONGODB_EVENT_STORE_URI')
}

// Create a singleton instance of the MongoDB event store
export const mongoEventStoreSingleton = getMongoDBEventStore({
  connectionString,
  projections: projections.inline([rbagEventProjection, rbagEventCategoryProjection])
})

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
