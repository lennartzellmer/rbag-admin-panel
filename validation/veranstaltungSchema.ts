import { z } from 'zod'
import { PlatzreservierungSchema } from './platzreservierungSchema'
import { VeranstaltungsKategorieSchema } from './veranstaltungsKategorieSchema'

export const AuffuehrungSchema = z.strictObject({
  datum: z.date(),
  startZeit: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM Format
  endZeit: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM Format
  plakat: z.string().url().optional(),
  beschreibung: z.string().optional(),
  auffuehrungsort: z.string(),
  platzreservierungen: z.array(PlatzreservierungSchema).optional()
})

export const VeranstaltungsStatusEnum = z.enum([
  'SaveTheDate',
  'AnmeldungStartet',
  'AnmeldungOffen',
  'AnmeldungGeschlossenNachmeldungMoeglich',
  'AnmeldungGeschlossen',
  'FindetGeradeStatt',
  'ErfolgreichStattgefunden',
  'NichtStattgefunden'
])

export const VeranstaltungSchema = VeranstaltungsKategorieSchema.partial().extend({
  kategorieId: z.string(),
  veranstaltungszeitraum: z.object({
    startDatum: z.date(),
    endDatum: z.date()
  }),
  anmeldezeitraum: z.object({
    startDatum: z.date(),
    endDatum: z.date()
  }),
  zusaetzlicheHinweise: z.string().optional(),
  musicalBeschreibung: z.string().optional(),
  veroeffentlicht: z.boolean().default(false),
  status: VeranstaltungsStatusEnum,
  statusUeberschrieben: z.string().optional(),
  anmeldungOffenUeberschrieben: z.boolean().optional(),
  checkinOffen: z.boolean().default(false),
  teilnahmebeitraege: z.record(z.string(), z.object({
    standard: z.number().nonnegative(),
    gefoerdert: z.number().nonnegative().optional()
  })),
  auffuehrung: AuffuehrungSchema.optional(),
  auffuehrungVeroeffentlicht: z.boolean().default(false)
})

// Exportieren der Typen
export type Platzreservierung = z.infer<typeof PlatzreservierungSchema>
export type Auffuehrung = z.infer<typeof AuffuehrungSchema>
export type VeranstaltungsStatus = z.infer<typeof VeranstaltungsStatusEnum>
export type Veranstaltung = z.infer<typeof VeranstaltungSchema>

// Schemas für create und update
export const CreateVeranstaltungSchema = VeranstaltungSchema.omit({ veroeffentlicht: true })
export const UpdateVeranstaltungSchema = VeranstaltungSchema.partial()

export type CreateVeranstaltung = z.infer<typeof CreateVeranstaltungSchema>
export type UpdateVeranstaltung = z.infer<typeof UpdateVeranstaltungSchema>
