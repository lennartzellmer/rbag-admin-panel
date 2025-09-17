import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import { getUserStreamSubjectById, type UserCreated } from './eventHandling'
import type { CreateUserSchema } from './validation'

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

// =============================================================================
// Command Handlers
// =============================================================================

export const createUser = (
  { command }: { command: CreateUser }
): UserCreated => {
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
      active: data.active ?? true
    },
    metadata: { requestedBy: metadata.requestedBy }
  })
}
