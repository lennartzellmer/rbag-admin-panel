import { randomUUID } from 'node:crypto'
import { createDomainEvent, createSubject } from 'vorfall'
import type { Command } from 'vorfall'
import { getRbagVeranstaltungsStreamSubjectById, type RbagVeranstaltungKategorieCreated, type RbagVeranstaltungKategorieUpdated } from '.'
import type { CreateRbagVeranstaltungKategorieSchema, UpdateRbagVeranstaltungKategorieSchema } from '~~/validation/categorySchema'

/////////////////////////////////////////
/// /////// Commands
/////////////////////////////////////////

export type EventCommandMetadata = {
  requestedBy: string
}

export type CreateRbagVeranstaltungKategorie = Command<
  'CreateRbagVeranstaltungKategorie',
  CreateRbagVeranstaltungKategorieSchema,
  EventCommandMetadata
>

export type UpdateRbagVeranstaltungKategorie = Command<
  'UpdateRbagVeranstaltungKategorie',
  UpdateRbagVeranstaltungKategorieSchema,
  EventCommandMetadata
>

/////////////////////////////////////////
/// /////// Business Logic
/////////////////////////////////////////

export const createRbagVeranstaltungKategorie = (
  { command }: { command: CreateRbagVeranstaltungKategorie }
): RbagVeranstaltungKategorieCreated => {
  const {
    data,
    metadata
  } = command

  const subject = getRbagVeranstaltungsStreamSubjectById(randomUUID())

  const event = createDomainEvent(
    {
      type: 'RbagVeranstaltungKategorieCreated',
      subject: subject,
      data: data,
      metadata: {
        changedBy: metadata.requestedBy
      }
    }
  )

  return event
}

export const updateRbagVeranstaltungKategorie = (
  { command }: { command: UpdateRbagVeranstaltungKategorie }
): RbagVeranstaltungKategorieUpdated => {
  const {
    data,
    metadata
  } = command

  if (!data.name && !data.description) {
    throw new Error('Kategorie name and description are missing. At least one of them must be provided')
  }

  const subject = createSubject(data.streamSubject)

  const event = createDomainEvent({
    type: 'RbagVeranstaltungKategorieUpdated',
    subject: subject,
    data: data,
    metadata: {
      changedBy: metadata.requestedBy
    }
  })

  return event
}
