import { IllegalStateError, type Command, type DefaultCommandMetadata } from '@event-driven-io/emmett'
import type { RbagEventCategoryCreated, RbagEventCategoryUpdated } from '.'
import type { CategorySchema, CreateRbagEventCategorySchema, UpdateRbagEventCategorySchema } from '~~/validation/categorySchema'

/////////////////////////////////////////
/// /////// Commands
/////////////////////////////////////////

export type EventCommandMetadata = DefaultCommandMetadata & {
  requestedBy: string
}

export type CreateRbagEventCategory = Command<
  'CreateRbagEventCategory',
  CreateRbagEventCategorySchema,
  EventCommandMetadata
>

export type UpdateRbagEventCategory = Command<
  'UpdateRbagEventCategory',
  UpdateRbagEventCategorySchema,
  EventCommandMetadata
>

/////////////////////////////////////////
/// /////// Business Logic
/////////////////////////////////////////

export const createRbagEventCategory = (
  command: CreateRbagEventCategory
): RbagEventCategoryCreated => {
  const {
    data,
    metadata
  } = command

  return {
    type: 'RbagEventCategoryCreated',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}

export const updateRbagEventCategory = (
  command: UpdateRbagEventCategory,
  state: CategorySchema
): RbagEventCategoryUpdated => {
  const {
    data,
    metadata
  } = command

  if (!data.name && !data.description) {
    throw new IllegalStateError('Category name and description are missing. At least one of them must be provided')
  }

  if (data.name === state.name) {
    throw new IllegalStateError('Category name hasn\'t changed')
  }

  if (data.description === state.description) {
    throw new IllegalStateError('Category description hasn\'t changed')
  }

  return {
    type: 'RbagEventCategoryUpdated',
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  }
}
