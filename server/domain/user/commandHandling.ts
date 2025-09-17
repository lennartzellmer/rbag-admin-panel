import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import { getUserStreamSubjectById, type UserCreated, type UserProfilePictureAttached } from './eventHandling'
import type { AttachUserProfilePictureSchema, CreateUserSchema } from './validation'

// =============================================================================
// Commands
// =============================================================================

export type EventCommandMetadata = {
  requestedBy: string
}

export type CreateUser = Command<
  'CreateUser',
  CreateUserSchema,
  EventCommandMetadata
>

export type AttachUserProfilePicture = Command<
  'AttachUserProfilePicture',
  AttachUserProfilePictureSchema,
  EventCommandMetadata & { id: string }
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
      provider: data.provider,
      profilePictureUrl: data.profilePictureUrl
    },
    metadata: { requestedBy: metadata.requestedBy }
  })
}

export const attachUserProfilePicture = (
  { command }: { command: AttachUserProfilePicture }
): UserProfilePictureAttached => {
  const { data, metadata } = command

  return createDomainEvent({
    type: 'UserProfilePictureAttached',
    subject: getUserStreamSubjectById(metadata.id),
    data,
    metadata: { requestedBy: metadata.requestedBy }
  })
}
