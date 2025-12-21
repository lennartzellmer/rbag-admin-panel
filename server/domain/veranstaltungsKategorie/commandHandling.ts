import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import type { AktualisiereVeranstaltungKategorieSchema, ErstelleVeranstaltungKategorieSchema } from './validation'
import { type VeranstaltungsKategorieErstellt, type VeranstaltungsKategorieAktualisiert, getVeranstaltungsKategorieStreamSubjectById } from './eventHandling'

// =============================================================================
// Commands
// =============================================================================

export type EventCommandMetadata = {
  requestedBy: string
}

export type ErstelleVeranstaltungKategorie = Command<
  'CreateVeranstaltungsKategorie',
  ErstelleVeranstaltungKategorieSchema,
  EventCommandMetadata
>

export type AktualisiereVeranstaltungKategorie = Command<
  'UpdateVeranstaltungsKategorie',
  AktualisiereVeranstaltungKategorieSchema,
  EventCommandMetadata & { id: string }
>

// =============================================================================
// Business Logic
// =============================================================================

export const erstelleVeranstaltungsKategorie = (
  { command }: { command: ErstelleVeranstaltungKategorie }
): VeranstaltungsKategorieErstellt => {
  const { data, metadata } = command

  const id = randomUUID()

  return createDomainEvent({
    type: 'VeranstaltungsKategorie.Erstellt',
    subject: getVeranstaltungsKategorieStreamSubjectById(id),
    data: {
      id,
      ...data
    },
    metadata: { requestedBy: metadata.requestedBy }
  })
}

export const aktualisiereRbagVeranstaltungKategorie = (
  { command }: { command: AktualisiereVeranstaltungKategorie }
): VeranstaltungsKategorieAktualisiert => {
  const { data, metadata } = command

  return createDomainEvent({
    type: 'VeranstaltungsKategorie.Aktualisiert',
    subject: getVeranstaltungsKategorieStreamSubjectById(metadata.id),
    data: data,
    metadata: { requestedBy: metadata.requestedBy }
  })
}
