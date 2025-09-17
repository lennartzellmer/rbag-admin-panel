import { afterAll } from 'vitest'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { setup } from '@nuxt/test-utils/e2e'

// =============================================================================
// Mongo Memory Server and nuxt test setup
// =============================================================================

export const setupCleanNuxtEnvironment = async () => {
  const mongoMemoryServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 } // Create a replica set with 1 member
  })
  const connectionString = mongoMemoryServer.getUri()

  process.env.NUXT_MONGODB_EVENT_STORE_URI = connectionString

  await setup()

  afterAll(async () => {
    await mongoMemoryServer.stop()
  })

  return connectionString
}
