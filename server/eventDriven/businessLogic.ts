import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import type { RbagEventCreated, RbagEventPerformanceSet, RbagEventRegistrationAdded } from './rbagEvent'
import type { EventDetailsSchema, EventSchema, PerformanceSchema, RegistrationSchema } from '~~/validation/eventSchema'

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
  RegistrationSchema,
  EventCommandMetadata
>

export type SetPerformanceDetails = Command<
  'SetPerformanceDetails',
  PerformanceSchema,
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

  return {
    type: 'RbagEventRegistrationAdded',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const setPerformanceDetails = (
  command: SetPerformanceDetails
): RbagEventPerformanceSet => {
  const {
    data,
    metadata
  } = command

  return {
    type: 'RbagEventPerformanceSet',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}
