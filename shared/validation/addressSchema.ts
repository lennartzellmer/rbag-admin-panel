import { z } from 'zod'

export const AdressSchema = z.strictObject({
  adresszeile1: z.string().min(1, 'Adresszeile 1 ist erforderlich'),
  adresszeile2: z.string().min(1).optional(),
  plz: z.string().min(1, 'PLZ ist erforderlich').regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
  ort: z.string().min(1, 'Ort ist erforderlich'),
  land: z.string().min(1, 'Land ist erforderlich')
})
