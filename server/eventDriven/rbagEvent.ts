import type { Event } from '@event-driven-io/emmett'
import type { StreamName, StreamType } from '@event-driven-io/emmett-mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { EventDetailsSchema, EventSchema, PerformanceSchema, RegistrationSchema } from '~~/validation/eventSchema'

export const RbagEventStreamType: StreamType = 'rbag_event'
export const generateRbagEventStreamName = (): StreamName<StreamType> => `${RbagEventStreamType}:${uuidv4()}`
export const getStreamNameById = (id: string): StreamName<StreamType> => `${RbagEventStreamType}:${id}`

/////////////////////////////////////////
/// /////// Events
/////////////////////////////////////////

export type RbagEventEventMetadata = {
  changedBy: string
}

export type RbagEventCreated = Event<
  'RbagEventCreated',
  EventDetailsSchema,
  RbagEventEventMetadata
>

export type RbagEventRegistrationAdded = Event<
  'RbagEventRegistrationAdded',
  RegistrationSchema,
  RbagEventEventMetadata
>

export type RbagEventPerformanceSet = Event<
  'RbagEventPerformanceSet',
  PerformanceSchema,
  RbagEventEventMetadata
>

export type RbagEventEvent =
  | RbagEventCreated
  | RbagEventRegistrationAdded
  | RbagEventPerformanceSet

export const initialState = (): EventSchema => {
  return {
    details: {
      name: '',
      abbreviation: '',
      startDate: new Date(),
      endDate: new Date(),
      targetGroupDescription: '',
      categoryId: ''
    },
    isCanceled: false,
    isPublished: false
  }
}

/////////////////////////////////////////
/// /////// Evolve
/////////////////////////////////////////

export const evolve = (
  state: EventSchema,
  event: RbagEventEvent
): EventSchema => {
  const { type, data } = event

  switch (type) {
    case 'RbagEventCreated':
      return {
        details: data,
        isPublished: false,
        isCanceled: false
      }
    case 'RbagEventRegistrationAdded':
      return {
        ...state,
        registration: data
      }
    case 'RbagEventPerformanceSet':
      return {
        ...state,
        performance: data
      }
    default: {
      // Exhaustive matching of the event type
      // This will throw a compile-time error
      // if a new event type is added and not handled here
      const _: never = event
      return state
    }
  }
}
