import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import { getMediaStreamSubjectById, type MediaCreated } from '../media/eventHandling'
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
    profileImageKey: string
    userId: string
  },
  CommandMetadata
>

export type RemoveProfileImage = Command<
  'RemoveProfileImage',
  { userId: string },
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
      id: userId,
      name: data.name,
      role: data.role,
      email: data.email,
      profileImage: data.profileImage
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
    key: data.profileImageKey,
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
      subject: getMediaStreamSubjectById(randomUUID()),
      data: mediaCreatedData,
      metadata: { requestedBy: metadata.requestedBy, userId: command.metadata.requestedBy.userId }
    })
  ]
}

export const removeProfileImage = (
  { command }: { command: RemoveProfileImage }
): UserProfileImageRemoved => {
  const { data, metadata } = command

  return createDomainEvent({
    type: 'UserProfileImageRemoved',
    subject: getUserStreamSubjectById(data.userId),
    metadata: metadata
  })
}
