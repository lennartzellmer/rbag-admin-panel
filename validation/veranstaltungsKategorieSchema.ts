import { z } from 'zod'
import { AdresseSchema } from './kontaktSchema'

export const AngebotSchema = z.strictObject({
  name: z.string().min(1),
  beschreibung: z.string().optional(),
  felder: z.array(z.object({
    name: z.string().min(1),
    typ: z.enum(['text', 'select', 'multiselect', 'checkbox']),
    optionen: z.array(z.string()).optional(),
    erforderlich: z.boolean().default(false)
  })).optional(),
  workshopleitung: z.array(z.string()).optional()
})
export const DauerSchema = z.strictObject({
  uebernachtungen: z.number().int().positive().optional(),
  startwochentag: z.enum(['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']).optional()
})

export const ProgrammpunktSchema = z.strictObject({
  name: z.string().min(1),
  beschreibung: z.string().optional(),
  anzeigebild: z.string().url().optional(),
  angebote: z.array(AngebotSchema).optional()
})

export const TeilnahmeBeitraegeSchema = z.strictObject({
  teilnahmegruppen: z.array(z.strictObject({
    name: z.string().min(1),
    minAlter: z.number().int().min(0),
    maxAlter: z.number().int().min(0),
    multiplikator: z.boolean(),
    beitrag: z.number().nonnegative().default(0)
  })),
  einzelzimmerzuschlag: z.number().nonnegative().default(0),
  gefoerderterBeitrag: z.number().nonnegative().default(0)
})

export const VeranstaltungsOrtSchema = AdresseSchema.partial().extend({
  name: z.string().min(1)
})

export const VeranstaltungsKategorieSchema = z.strictObject({
  name: z.string().min(1),
  beschreibung: z.string().min(1),
  zielgruppe: z.string(),
  dauer: DauerSchema.optional(),
  veranstaltungsort: VeranstaltungsOrtSchema.optional(),
  anzeigebild: z.string().url(),
  veranstaltungsleitung: z.array(z.string()).optional(),
  programmpunkte: z.array(ProgrammpunktSchema).optional(),
  teilnahmebeitraege: TeilnahmeBeitraegeSchema
})

export const UpdateVeranstaltungsKategorieSchema = VeranstaltungsKategorieSchema.partial()

export type Angebot = z.infer<typeof AngebotSchema>
export type Programmpunkt = z.infer<typeof ProgrammpunktSchema>
export type TeilnahmeBeitraege = z.infer<typeof TeilnahmeBeitraegeSchema>
export type Dauer = z.infer<typeof DauerSchema>
export type VeranstaltungsKategorie = z.infer<typeof VeranstaltungsKategorieSchema>
export type UpdateVeranstaltungsKategorie = z.infer<typeof UpdateVeranstaltungsKategorieSchema>
