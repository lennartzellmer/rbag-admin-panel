import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import type { RbagEventCreated, RbagEventRegistrationAdded } from './rbagEvent'
import type { EventDetailsSchema, EventSchema, RegistrationSchema } from '~~/validation/eventSchema'

/////////////////////////////////////////
/// /////// Commands
/////////////////////////////////////////

export type EventCommandMetadata = DefaultCommandMetadata & {
  requestedBy: string
}

export type AddRgabEventAsDraft = Command<
  'AddRbagEventAsDraft',
  EventDetailsSchema,
  EventCommandMetadata
>

export type AddRegistrationDetails = Command<
  'AddRegistrationDetails',
  RegistrationSchema & { eventId: string },
  EventCommandMetadata
>

/////////////////////////////////////////
/// /////// Business Logic
/////////////////////////////////////////

export const addRbagEventAsDraft = (
  command: AddRgabEventAsDraft
): RbagEventCreated => {
  const {
    data,
    metadata
  } = command

  return {
    type: 'RbagEventCreated',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const addRegistrationDetails = (
  command: AddRegistrationDetails,
  state: EventSchema
): RbagEventRegistrationAdded => {
  const {
    data,
    metadata
  } = command

  const { registration } = state

  if (registration)
    throw new IllegalStateError('Registration already exists')

  if (data.startDate < data.endDate)
    throw new IllegalStateError('Start date must be before end date')

  return {
    type: 'RbagEventRegistrationAdded',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}
