import type { Db, Collection, Document } from 'mongodb'
import { MongoClient } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'events_db'

let client: MongoClient
let db: Db

export async function connect(): Promise<Db> {
  if (!db) {
    client = new MongoClient(MONGO_URI)
    await client.connect()
    db = client.db(DB_NAME)
  }
  return db
}

export function getCollection<T extends Document>(name: string): Collection<T> {
  if (!db) throw new Error('Database not connected yet')
  return db.collection<T>(name)
}
