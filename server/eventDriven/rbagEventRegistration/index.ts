import type { Event } from '@event-driven-io/emmett'
import { toStreamName, type StreamType } from '@event-driven-io/emmett-mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { CategorySchema, CreateRbagEventCategorySchema, UpdateRbagEventCategorySchema } from '~~/validation/categorySchema'

/////////////////////////////////////////
/// /////// Name generation
/////////////////////////////////////////

export const rbagEventCategoryStreamType: StreamType = 'rbag_event_registration'
export const generateRbagEventCategoryStreamName = () => toStreamName(rbagEventCategoryStreamType, uuidv4())
export const getRbagEventCategoryStreamNameById = (id: string) => toStreamName(rbagEventCategoryStreamType, id)

/////////////////////////////////////////
/// /////// Events
/////////////////////////////////////////

export type RbagEventEventMetadata = {
  changedBy: string
}

export type RbagEventRegistrationCreated = Event<
  'RbagEventRegistrationCreated',
  {
    name: string
    birthDate: string
    email: string
    phone: string
  },
  RbagEventEventMetadata
>

export type RbagEventRegistrationEvent =
  | RbagEventRegistrationCreated

export const initialState = (): CategorySchema => {
  return {
    name: '',
    description: ''
  }
}

/////////////////////////////////////////
/// /////// Evolve
/////////////////////////////////////////

export const evolve = (
  state: CategorySchema,
  event: RbagEventRegistrationEvent
): CategorySchema => {
  const { type, data } = event

  switch (type) {
    case 'RbagEventRegistrationCreated': {
      return data
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
