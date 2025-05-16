// src/services/mongodb.ts
import type { Db, MongoClientOptions } from 'mongodb'
import { MongoClient } from 'mongodb'

export interface MongoConnectionConfig {
  uri: string
  dbName: string
  options?: MongoClientOptions
}

export class MongoDBSingleton {
  private static instance: MongoDBSingleton

  public readonly client: MongoClient
  public readonly db: Db
  private connectionPromise: Promise<void>

  private constructor(config: MongoConnectionConfig) {
    this.client = new MongoClient(config.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      ...config.options
    })

    this.db = this.client.db(config.dbName)

    this.connectionPromise = this.client.connect().then(() => {
      console.log(`MongoDB connected to ${config.dbName}`)
    })
  }

  public static getInstance(config?: MongoConnectionConfig): MongoDBSingleton {
    if (!MongoDBSingleton.instance) {
      if (!config) {
        throw new Error('MongoDB configuration required for first initialization')
      }
      MongoDBSingleton.instance = new MongoDBSingleton(config)
    }
    return MongoDBSingleton.instance
  }

  public async ready(): Promise<void> {
    await this.connectionPromise
  }

  public async close(): Promise<void> {
    await this.client.close()
    console.log('MongoDB connection closed')
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.db.admin().ping()
      return true
    }
    catch {
      return false
    }
  }
}

// Convenience functions
export const createMongoDBSingleton = (config: MongoConnectionConfig) => MongoDBSingleton.getInstance(config)
export const getMongoDBSingleton = () => MongoDBSingleton.getInstance()
export const getDB = () => MongoDBSingleton.getInstance().db
export const getClient = () => MongoDBSingleton.getInstance().client
