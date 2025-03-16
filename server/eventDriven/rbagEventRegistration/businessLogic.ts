import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import { getRbagEventById } from '../rbagEvents'
import type { RbagEventRegistrationCreated } from '.'
import type { Registration } from '~~/validation/registrationSchema'
import { mongoEventStoreSingleton } from '~~/server/plugins/mongoEventStore'

/////////////////////////////////////////
/// /////// Commands
/////////////////////////////////////////

export type EventCommandMetadata = DefaultCommandMetadata & {
  requestedBy: string
}

export type CreateRbagEventRegistration = Command<
  'CreateRbagEventRegistration',
  Registration,
  EventCommandMetadata
>

/////////////////////////////////////////
/// /////// Business Logic
/////////////////////////////////////////

export const createRbagEventRegistration = async (
  command: CreateRbagEventRegistration,
  state: Registration | null
): Promise<RbagEventRegistrationCreated> => {
  const {
    data,
    metadata
  } = command

  const event = await getRbagEventById(mongoEventStoreSingleton, data.eventId)
  if (!event) {
    throw new IllegalStateError('Event does not exist')
  }
  if (state !== null) {
    throw new IllegalStateError('Registration already exists')
  }

  return {
    type: 'RbagEventRegistrationCreated',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}
