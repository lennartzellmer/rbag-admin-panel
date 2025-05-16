import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  /////////////////////////////////////////
  /// /////// Handle command
  /////////////////////////////////////////
  const eventStore = event.context.eventStore
  console.log('eventStore')
  console.log(await eventStore.db.collection('events').insertOne({
    event: 'test',
    data: 'test'
  }))
})
