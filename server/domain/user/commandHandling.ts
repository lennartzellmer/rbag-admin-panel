import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import type { MediaDeleted, MediaCreated } from '../media/eventHandling'
import { getMediaStreamSubjectById } from '../media/eventHandling'
import type { UserCreated, UserProfileImageAttached, UserProfileImageRemoved } from './eventHandling'
import { getUserStreamSubjectById } from './eventHandling'
import type { CreateUserSchema } from './validation'

// =============================================================================
// Commands
// =============================================================================

export type CommandMetadata = {
  requestedBy: {
    userId: string
    email: string
  }
}

export type CreateUser = Command<
  'CreateUser',
  CreateUserSchema,
  CommandMetadata
>

export type AttachProfileImage = Command<
  'AttachProfileImage',
  {
    profileImageObjectName: string
    userId: string
  },
  CommandMetadata
>

export type RemoveProfileImage = Command<
  'RemoveProfileImage',
  {
    profileImageObjectName: string
    userId: string
  },
  CommandMetadata
>

// =============================================================================
// Command Handlers
// =============================================================================

export const createUser = async (
  { command }: { command: CreateUser }
): Promise<UserCreated> => {
  const { data, metadata } = command

  const userId = data.id ?? randomUUID()

  return createDomainEvent({
    type: 'UserCreated',
    subject: getUserStreamSubjectById(userId),
    data: {
      id: userId
    },
    metadata: metadata
  })
}

export const attachProfileImage = (
  { command }: { command: AttachProfileImage }
): Array<UserProfileImageAttached | MediaCreated> => {
  const { data, metadata } = command

  const mediaCreatedData = {
    id: randomUUID(),
    key: data.profileImageObjectName,
    ownerId: command.data.userId,
    visibility: 'internal',
    status: 'active',
    size: 123
  } as const

  return [
    createDomainEvent({
      type: 'UserProfileImageAttached',
      subject: getUserStreamSubjectById(command.data.userId),
      data,
      metadata: { requestedBy: metadata.requestedBy }
    }),
    createDomainEvent({
      type: 'MediaCreated',
      subject: getMediaStreamSubjectById(command.data.profileImageObjectName),
      data: mediaCreatedData,
      metadata: { requestedBy: metadata.requestedBy, userId: command.metadata.requestedBy.userId }
    })
  ]
}

export const removeProfileImage = (
  { command }: { command: RemoveProfileImage }
): Array<UserProfileImageRemoved | MediaDeleted> => {
  const { data, metadata } = command

  return [
    createDomainEvent({
      type: 'UserProfileImageRemoved',
      subject: getUserStreamSubjectById(data.userId),
      metadata: metadata
    }),
    createDomainEvent({
      type: 'MediaDeleted',
      subject: getMediaStreamSubjectById(command.data.profileImageObjectName),
      metadata: metadata
    })
  ]
}
