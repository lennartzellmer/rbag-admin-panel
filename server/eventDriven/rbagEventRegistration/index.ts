import type { Event } from '@event-driven-io/emmett'
import { mongoDBInlineProjection, toStreamName, type MongoDBEventStore, type StreamType } from '@event-driven-io/emmett-mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { Registration, RegistrationUpdate } from '~~/validation/registrationSchema'

/////////////////////////////////////////
/// /////// Name generation
/////////////////////////////////////////

export const rbagEventRegistrationStreamType: StreamType = 'rbag_event_registration'
export const generateRbagEventRegistrationStreamName = () => toStreamName(rbagEventRegistrationStreamType, uuidv4())
export const getRbagEventRegistrationStreamNameById = (id: string) => toStreamName(rbagEventRegistrationStreamType, id)

/////////////////////////////////////////
/// /////// Events
/////////////////////////////////////////

export type RbagEventEventMetadata = {
  changedBy: string
}

export type RbagEventRegistrationCreated = Event<
  'RbagEventRegistrationCreated',
  Registration,
  RbagEventEventMetadata
>

export type RbagEventRegistrationUpdated = Event<
  'RbagEventRegistrationUpdated',
  RegistrationUpdate,
  RbagEventEventMetadata
>

export type RbagEventRegistrationEvent =
  | RbagEventRegistrationCreated
  | RbagEventRegistrationUpdated

/////////////////////////////////////////
/// /////// Evolve
/////////////////////////////////////////

export const evolve = (
  state: Registration | null,
  event: RbagEventRegistrationEvent
): Registration | null => {
  const { type, data } = event

  if (!state) {
    if (type === 'RbagEventRegistrationCreated') {
      return { ...data }
    }
    return state
  }

  switch (type) {
    case 'RbagEventRegistrationCreated': {
      return { ...data }
    }
    case 'RbagEventRegistrationUpdated': {
      return {
        ...state,
        ...data
      }
    }
    default: {
      // Exhaustive matching of the event type
      // This will throw a TS error if a new event type is added and not handled here
      const _: never = event
      return state
    }
  }
}

/////////////////////////////////////////
/// /////// Projections
/////////////////////////////////////////

export const rbagEventRegistrationProjectionName = 'rbagEventRegistration'

export const getRbagEventRegistrationsByEventIdPaginated = (eventStore: MongoDBEventStore, eventId: string, skip: number, limit: number
) => eventStore.projections.inline.find<Registration[]>({
  streamType: rbagEventRegistrationStreamType,
  projectionName: rbagEventRegistrationProjectionName
},
{ eventId },
{ limit, skip })

export const getRbagEventRegistrationById = (eventStore: MongoDBEventStore, id: string) =>
  eventStore.projections.inline.findOne<Registration>({
    streamName: getRbagEventRegistrationStreamNameById(id),
    projectionName: rbagEventRegistrationProjectionName
  })

export const rbagEventRegistrationProjection = mongoDBInlineProjection({
  name: rbagEventRegistrationProjectionName,
  evolve,
  canHandle: [
    'RbagEventRegistrationCreated'
  ]
})
