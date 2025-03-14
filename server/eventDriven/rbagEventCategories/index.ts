import type { Event } from '@event-driven-io/emmett'
import { mongoDBInlineProjection, toStreamName, type MongoDBEventStore, type StreamType } from '@event-driven-io/emmett-mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { CategorySchema, CreateRbagEventCategorySchema, UpdateRbagEventCategorySchema } from '~~/validation/categorySchema'

/////////////////////////////////////////
/// /////// Name generation
/////////////////////////////////////////

export const rbagEventCategoryStreamType: StreamType = 'rbag_event_category'
export const generateRbagEventCategoryStreamName = () => toStreamName(rbagEventCategoryStreamType, uuidv4())
export const getRbagEventCategoryStreamNameById = (id: string) => toStreamName(rbagEventCategoryStreamType, id)

/////////////////////////////////////////
/// /////// Events
/////////////////////////////////////////

export type RbagEventEventMetadata = {
  changedBy: string
}

export type RbagEventCategoryCreated = Event<
  'RbagEventCategoryCreated',
  CreateRbagEventCategorySchema,
  RbagEventEventMetadata
>

export type RbagEventCategoryUpdated = Event<
  'RbagEventCategoryUpdated',
  UpdateRbagEventCategorySchema,
  RbagEventEventMetadata
>

export type RbagEventCategoryEvent =
  | RbagEventCategoryCreated
  | RbagEventCategoryUpdated

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
  event: RbagEventCategoryEvent
): CategorySchema => {
  const { type, data } = event

  switch (type) {
    case 'RbagEventCategoryCreated': {
      return data
    }
    case 'RbagEventCategoryUpdated': {
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

export const rbagEventCategoryProjectionName = 'rbagEventCategory'

export const getRbagEventCategoriesPaginated = (eventStore: MongoDBEventStore, skip: number, limit: number) =>
  eventStore.projections.inline.find<CategorySchema[]>({
    streamType: rbagEventCategoryStreamType,
    projectionName: rbagEventCategoryProjectionName
  },
  {},
  {
    limit,
    skip
  })

export const getRbagEventCategoryById = (eventStore: MongoDBEventStore, id: string) =>
  eventStore.projections.inline.findOne<CategorySchema[]>({
    streamName: getRbagEventCategoryStreamNameById(id),
    projectionName: rbagEventCategoryProjectionName
  })

export const rbagEventCategoryProjection = mongoDBInlineProjection({
  name: rbagEventCategoryProjectionName,
  evolve,
  canHandle: [
    'RbagEventCategoryCreated',
    'RbagEventCategoryUpdated'
  ],
  initialState
})
