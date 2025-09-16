import { z } from 'zod'
import { AdressSchema } from './addressSchema'

export const AngebotsSchema = z.strictObject({
  name: z.string().min(1),
  beschreibung: z.string().optional(),
  felder: z.array(z.object({
    name: z.string().min(1),
    typ: z.enum(['text', 'select', 'multiselect', 'checkbox']),
    optionen: z.array(z.string()).optional(),
    erforderlich: z.boolean().default(false)
  })).optional(),
  leitung: z.array(z.string()).optional()
})

export const ProgrammSchema = z.strictObject({
  name: z.string().min(1),
  beschreibung: z.string().optional(),
  anzeigebild: z.string().url().optional(),
  angebote: z.array(AngebotsSchema).optional()
})

export const ortsSchema = AdressSchema.partial().extend({
  name: z.string().min(1)
})

export const TeilnahmeBeitragsSchema = z.strictObject({
  teilnahmegruppen: z.array(z.strictObject({
    name: z.string().min(1),
    minAlter: z.number().int().min(0),
    maxAlter: z.number().int().min(0),
    beitrag: z.number().nonnegative().default(0),
    gefoerderterBeitrag: z.number().nonnegative().default(0)
  })),
  einzelzimmerzuschlag: z.number().nonnegative().default(0).optional()
})

export const voreinstellungenSchema = z.strictObject({
  zielgruppe: z.string().min(1),
  beschreibung: z.string().min(1),
  ort: ortsSchema.optional(),
  anzeigebild: z.string().url().optional(),
  leitung: z.array(z.string()).optional(),
  programm: z.array(ProgrammSchema).optional(),
  teilnahmebeitraege: TeilnahmeBeitragsSchema.optional()
})

export const veranstaltungsKategorieSchema = z.object({
  name: z.string().min(1),
  voreinstellungen: voreinstellungenSchema.optional()
})

export type VeranstaltungsKategorieSchema = z.infer<typeof veranstaltungsKategorieSchema>
