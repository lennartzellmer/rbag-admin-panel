import { z } from 'zod'
import { AdressSchema } from './addressSchema'
import { mediaSchema } from './mediaSchema'

export const ortsSchema = AdressSchema.partial().extend({
  name: z.string().min(1, 'Ortsname muss etwas länger sein.')
})

export const voreinstellungenSchema = z.strictObject({
  zielgruppe: z.string().min(1, 'Zielgruppe muss etwas länger beschrieben werden.'),
  beschreibung: z.string().min(1, 'Beschreibung muss etwas länger werden.'),
  ort: ortsSchema,
  anzeigebild: mediaSchema,
  leitung: z.object({
    userIds: z.array(z.string())
  })
})

export const veranstaltungsKategorieSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, 'Name muss etwas länger sein.'),
  beschreibung: z.string().min(3, 'Beschreibung muss etwas länger sein.'),
  voreinstellungen: voreinstellungenSchema
})

export const veranstaltungsKategorieUpdateSchema
  = veranstaltungsKategorieSchema
    .omit({ id: true })
    .partial()

export const veranstaltungsKategorieCreateSchema
  = veranstaltungsKategorieSchema
    .omit({ id: true })

export type VeranstaltungsKategorieSchema = z.infer<typeof veranstaltungsKategorieSchema>
export type VeranstaltungsKategorieCreateSchema = z.infer<typeof veranstaltungsKategorieCreateSchema>
export type VeranstaltungsKategorieUpdateSchema = z.infer<typeof veranstaltungsKategorieUpdateSchema>
