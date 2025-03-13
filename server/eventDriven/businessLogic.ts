import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import { fromDate, now } from '@internationalized/date'
import type { RbagEventCreated, RbagEventPerformanceSet, RbagEventRegistrationAdded, RbagEventRegistrationRescheduled } from './rbagEvent'
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

export type RescheduleRegistration = Command<
  'RescheduleRegistration',
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

export const rescheduleRegistration = (
  command: RescheduleRegistration,
  state: EventSchema
): RbagEventRegistrationRescheduled => {
  const {
    data,
    metadata
  } = command

  const { registration } = state

  const TIMEZONE_IDENTIFIER = 'UTC'

  if (!registration)
    throw new IllegalStateError('Registration does not exist yet')

  const currentDate = now(TIMEZONE_IDENTIFIER)
  const currentStartDate = fromDate(registration.startDate, TIMEZONE_IDENTIFIER)
  const currentEndDate = fromDate(registration.endDate, TIMEZONE_IDENTIFIER)
  const newEndDate = fromDate(data.endDate, TIMEZONE_IDENTIFIER)

  // if registration is currently running and new end date is in the past throw error
  if (currentDate.compare(currentStartDate) >= 0 && currentDate.compare(currentEndDate) <= 0) {
    if (newEndDate.compare(currentDate) < 0)
      throw new IllegalStateError('Registration is currently running and new end date is in the past.')
  }

  return {
    type: 'RbagEventRegistrationRescheduled',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}
