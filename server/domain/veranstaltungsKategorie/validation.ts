import type { z } from 'zod'
import { veranstaltungsKategorieSchema, voreinstellungenSchema } from '~~/validation/veranstaltungKategorieSchema'

export const erstelleVeranstaltungKategorieSchema = veranstaltungsKategorieSchema.pick({
  name: true
})

export const aktualisiereVeranstaltungKategorieSchema = veranstaltungsKategorieSchema.partial()

export const aktualisiereVoreinstellungenSchema = voreinstellungenSchema

export type ErstelleVeranstaltungKategorieSchema = z.infer<typeof erstelleVeranstaltungKategorieSchema>
export type AktualisiereVeranstaltungKategorieSchema = z.infer<typeof aktualisiereVeranstaltungKategorieSchema>
export type AktualisiereVoreinstellungenSchema = z.infer<typeof aktualisiereVoreinstellungenSchema>
