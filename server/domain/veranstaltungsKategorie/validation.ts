import type { z } from 'zod'
import { veranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

// =============================================================================
// Schemas commands
// =============================================================================

export const erstelleVeranstaltungKategorieSchema = veranstaltungsKategorieSchema.pick({
  name: true
})

export const aktualisiereVeranstaltungKategorieSchema = veranstaltungsKategorieSchema.partial()

export type ErstelleVeranstaltungKategorieSchema = z.infer<typeof erstelleVeranstaltungKategorieSchema>
export type AktualisiereVeranstaltungKategorieSchema = z.infer<typeof aktualisiereVeranstaltungKategorieSchema>

// =============================================================================
// Schemas events
// =============================================================================

export const veranstaltungKategorieErstelltSchema = veranstaltungsKategorieSchema.pick({
  id: true,
  name: true
})

export const veranstaltungKategorieAktualisiertSchema = veranstaltungsKategorieSchema.partial()

export type VeranstaltungKategorieErstelltSchema = z.infer<typeof veranstaltungKategorieErstelltSchema>
export type VeranstaltungKategorieAktualisiertSchema = z.infer<typeof veranstaltungKategorieAktualisiertSchema>
