import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import { getVeranstaltungStreamSubjectById, type VeranstaltungErstellt } from '.'
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
): VeranstaltungErstellt => {
  const {
    data,
    metadata
  } = command

  const subject = getVeranstaltungStreamSubjectById(randomUUID())

  const event = createDomainEvent(
    {
      type: 'VeranstaltungErstellt',
      subject: subject,
      data: data,
      metadata: {
        changedBy: metadata.requestedBy
      }
    }
  )

  return event
}
