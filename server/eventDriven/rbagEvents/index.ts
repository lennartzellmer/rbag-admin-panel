import type { Event } from '@event-driven-io/emmett'
import { mongoDBInlineProjection, toStreamName, type MongoDBEventStore, type StreamType } from '@event-driven-io/emmett-mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { EventDetailsSchema, EventSchema, PerformanceSchema, RegistrationSchema } from '~~/validation/eventSchema'

/////////////////////////////////////////
/// /////// Name generation
/////////////////////////////////////////

export const rbagEventStreamType: StreamType = 'rbag_event'
export const generateRbagEventStreamName = () => toStreamName(rbagEventStreamType, uuidv4())
export const getRbagEventStreamNameById = (id: string) => toStreamName(rbagEventStreamType, id)

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

export type RbagEventRegistrationRescheduled = Event<
  'RbagEventRegistrationRescheduled',
  RegistrationSchema,
  RbagEventEventMetadata
>

export type RbagEventPerformanceSet = Event<
  'RbagEventPerformanceSet',
  PerformanceSchema,
  RbagEventEventMetadata
>

export type RbagEventCategorySet = Event<
  'RbagEventCategorySet',
  { categoryId: string },
  RbagEventEventMetadata
>

export type RbagEventRegistrationDetailsUpdated = Event<
  'RbagEventRegistrationDetailsUpdated',
  Pick<RegistrationSchema, 'confirmationText' | 'formPDFDownloadLink'>,
  RbagEventEventMetadata
>

export type RbagEventCanceled = Event<
  'RbagEventCanceled',
  Record<never, never>,
  RbagEventEventMetadata
>

export type RbagEventPublished = Event<
  'RbagEventPublished',
  Record<never, never>,
  RbagEventEventMetadata
>

export type RbagEventUnpublished = Event<
  'RbagEventUnpublished',
  Record<never, never>,
  RbagEventEventMetadata
>

export type RbagEventEvent =
  | RbagEventCreated
  | RbagEventRegistrationAdded
  | RbagEventPerformanceSet
  | RbagEventRegistrationRescheduled
  | RbagEventRegistrationDetailsUpdated
  | RbagEventCanceled
  | RbagEventPublished
  | RbagEventUnpublished
  | RbagEventCategorySet

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
    case 'RbagEventRegistrationRescheduled':
      return {
        ...state,
        registration: data
      }
    case 'RbagEventRegistrationDetailsUpdated':
      return {
        ...state,
        registration: {
          ...state.registration!,
          ...data
        }
      }
    case 'RbagEventCanceled':
      return {
        ...state,
        isCanceled: true
      }
    case 'RbagEventPublished':
      return {
        ...state,
        isPublished: true
      }
    case 'RbagEventUnpublished':
      return {
        ...state,
        isPublished: false
      }
    case 'RbagEventCategorySet':
      return {
        ...state,
        ...data
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

export const rbagEventProjectionName = 'rbagEvent'

export const getRbagEventsPaginated = (eventStore: MongoDBEventStore, skip: number, limit: number
) => eventStore.projections.inline.find<EventSchema[]>({
  streamType: rbagEventStreamType,
  projectionName: rbagEventProjectionName
},
{},
{
  limit,
  skip
})

export const getRbagEventById = (eventStore: MongoDBEventStore, id: string) =>
  eventStore.projections.inline.findOne<EventSchema[]>({
    streamName: getRbagEventStreamNameById(id),
    projectionName: rbagEventProjectionName
  })

export const rbagEventProjection = mongoDBInlineProjection({
  name: rbagEventProjectionName,
  evolve,
  canHandle: [
    'RbagEventCreated',
    'RbagEventPerformanceSet',
    'RbagEventRegistrationAdded',
    'RbagEventRegistrationRescheduled'
  ],
  initialState
})
