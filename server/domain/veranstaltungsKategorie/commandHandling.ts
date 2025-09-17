import { randomUUID } from 'node:crypto'
import { createDomainEvent } from 'vorfall'
import type { Command } from 'vorfall'
import type { AktualisiereVeranstaltungKategorieSchema, AktualisiereVoreinstellungenSchema, ErstelleVeranstaltungKategorieSchema } from './validation'
import { type VeranstaltungsKategorieErstellt, type VeranstaltungsKategorieAktualisiert, type KategorieVoreinstellungenAktualisiert, getVeranstaltungsKategorieStreamSubjectById } from './eventHandling'

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

export type AktualisiereKategorieVoreinstellungen = Command<
  'UpdateVeranstaltungsKategorieVoreinstellungen',
  AktualisiereVoreinstellungenSchema,
  EventCommandMetadata & { id: string }
>

// =============================================================================
// Business Logic
// =============================================================================

export const createVeranstaltungsKategorie = (
  { command }: { command: ErstelleVeranstaltungKategorie }
): VeranstaltungsKategorieErstellt => {
  const { data, metadata } = command

  return createDomainEvent({
    type: 'VeranstaltungsKategorie.Erstellt',
    subject: getVeranstaltungsKategorieStreamSubjectById(randomUUID()),
    data: data,
    metadata: { requestedBy: metadata.requestedBy }
  })
}

export const updateRbagVeranstaltungKategorie = (
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

export const updateRbagVeranstaltungKategorieVoreinstellungen = (
  { command }: { command: AktualisiereKategorieVoreinstellungen }
): KategorieVoreinstellungenAktualisiert => {
  const { data, metadata } = command

  return createDomainEvent({
    type: 'VeranstaltungsKategorie.Voreinstellungen.Aktualisiert',
    subject: getVeranstaltungsKategorieStreamSubjectById(metadata.id),
    data: data,
    metadata: { requestedBy: metadata.requestedBy }
  })
}
