import type { Nitro } from 'nitropack'
import mongoose from 'mongoose'

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig()
  try {
    await mongoose.connect(config.mongodbUri, {
      dbName: 'org_management_service'
    })
    console.log('Connected to MongoDB')
  }
  catch (e) {
    console.error(e)
  }
}
