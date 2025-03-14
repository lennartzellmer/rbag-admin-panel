import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import { fromDate, now } from '@internationalized/date'
import { getRbagEventCategoryById } from '../rbagEventCategories'
import type { RbagEventCanceled, RbagEventCreated, RbagEventPerformanceSet, RbagEventPublished, RbagEventRegistrationAdded, RbagEventRegistrationDetailsUpdated, RbagEventRegistrationRescheduled, RbagEventUnpublished } from '.'
import type { EventDetailsSchema, EventSchema, PerformanceSchema, RegistrationSchema } from '~~/validation/eventSchema'
import { mongoEventStoreSingleton } from '~~/server/plugins/mongoEventStore'

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

export type UpdateRegistrationDetails = Command<
  'UpdateRegistrationDetails',
  Pick<RegistrationSchema, 'confirmationText' | 'formPDFDownloadLink'>,
  EventCommandMetadata
>

export type SetPerformanceDetails = Command<
  'SetPerformanceDetails',
  PerformanceSchema,
  EventCommandMetadata
>

export type CancelRbagEvent = Command<
  'CancelRbagEvent',
  Record<string, never>,
  EventCommandMetadata
>

export type PublishRbagEvent = Command<
  'PublishRbagEvent',
  Record<string, never>,
  EventCommandMetadata
>

export type UnpublishRbagEvent = Command<
  'UnpublishRbagEvent',
  Record<string, never>,
  EventCommandMetadata
>

/////////////////////////////////////////
/// /////// Business Logic
/////////////////////////////////////////

export const addRbagEventAsDraft = async (
  command: AddRgabEventAsDraft
): Promise<RbagEventCreated> => {
  const {
    data,
    metadata
  } = command

  const eventCategory = await getRbagEventCategoryById(mongoEventStoreSingleton, data.categoryId)
  if (!eventCategory) {
    throw new IllegalStateError('Event category does not exist')
  }

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

export const updateRegistrationDetails = (
  command: UpdateRegistrationDetails,
  state: EventSchema
): RbagEventRegistrationDetailsUpdated => {
  const {
    data,
    metadata
  } = command

  const { registration } = state

  if (!registration)
    throw new IllegalStateError('Registration does not exist yet')

  return {
    type: 'RbagEventRegistrationDetailsUpdated',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const cancelRbagEvent = (
  command: CancelRbagEvent
): RbagEventCanceled => {
  const { metadata } = command

  return {
    type: 'RbagEventCanceled',
    data: {},
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const publishRbagEvent = (
  command: PublishRbagEvent
): RbagEventPublished => {
  const { metadata } = command

  return {
    type: 'RbagEventPublished',
    data: {},
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const unpublishRbagEvent = (
  command: UnpublishRbagEvent
): RbagEventUnpublished => {
  const { metadata } = command

  return {
    type: 'RbagEventUnpublished',
    data: {},
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
