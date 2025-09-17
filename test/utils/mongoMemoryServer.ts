import { afterAll } from 'vitest'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

// =============================================================================
// Mongo Memory Server setup for E2E tests
// =============================================================================

export const setupMongoMemoryServer = async () => {
  const mongoMemoryServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 } // Create a replica set with 1 member
  })
  const connectionString = mongoMemoryServer.getUri()

  process.env.NUXT_MONGODB_EVENT_STORE_URI = connectionString

  afterAll(async () => {
    await mongoMemoryServer.stop()
  })

  return connectionString
}
