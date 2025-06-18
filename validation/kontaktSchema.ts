import { z } from 'zod'

export const AdresseSchema = z.strictObject({
  straße: z.string().min(1, 'Straße ist erforderlich'),
  hausnummer: z.string().min(1, 'Hausnummer ist erforderlich'),
  plz: z.string().min(1, 'PLZ ist erforderlich').regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
  ort: z.string().min(1, 'Ort ist erforderlich'),
  land: z.string().min(1, 'Land ist erforderlich')
})

export const AdresseUpdateSchema = AdresseSchema.partial()

export const KontaktSchema = z.strictObject({
  vorname: z.string().min(1, 'Vorname ist erforderlich'),
  nachname: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  adresse: AdresseSchema
})

export const KontaktUpdateSchema = KontaktSchema.partial()

export type Adresse = z.infer<typeof AdresseSchema>
export type AdresseUpdate = z.infer<typeof AdresseUpdateSchema>
export type Kontakt = z.infer<typeof KontaktSchema>
export type KontaktUpdate = z.infer<typeof KontaktUpdateSchema>
