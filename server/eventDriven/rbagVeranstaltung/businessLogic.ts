import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import { getRbagVeranstaltungStreamSubjectById, type RbagVeranstaltungCreated } from '.'
import type { CreateRbagVeranstaltungSchema } from '~~/validation/veranstaltungSchema'

// =============================================================================
// Commands
// =============================================================================

export type EventCommandMetadata = {
  requestedBy: string
}

export type CreateRbagVeranstaltung = Command<
  'CreateRbagVeranstaltung',
  CreateRbagVeranstaltungSchema,
  EventCommandMetadata
>

// =============================================================================
// Business Logic
// =============================================================================

export const createRbagVeranstaltung = (
  { command }: { command: CreateRbagVeranstaltung }
): RbagVeranstaltungCreated => {
  const {
    data,
    metadata
  } = command

  const subject = getRbagVeranstaltungStreamSubjectById(randomUUID())

  const event = createDomainEvent(
    {
      type: 'RbagVeranstaltungCreated',
      subject: subject,
      data: data,
      metadata: {
        changedBy: metadata.requestedBy
      }
    }
  )

  return event
}
