export class EventStore {
  private events: any[] = []
  private eventStore: any

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
