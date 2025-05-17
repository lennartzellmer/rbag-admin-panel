export type StreamType = string
export type StreamName<T extends StreamType = StreamType> = `${T}:${string}`

export type StreamNameParts<T extends StreamType = StreamType> = {
  streamType: T
  streamId: string
}

export type StreamCollectionName<T extends StreamType = StreamType> =
  `emt:${T}`

export type StreamCollectionNameParts<T extends StreamType = StreamType> = {
  streamType: T
}

export class EventStore {
  private events: any[] = []
  private eventStore: any
  mongoDb: MongoDb

  constructor(eventStore: any) {
    this.eventStore = eventStore
  }

  async addEvent(event: any) {
    this.events.push(event)
    await this.eventStore.db.collection('events').insertOne(event)
  }

  async getEvents() {
    return await this.eventStore.db.collection('events').find().toArray()
  }
}
