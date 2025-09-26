import { z } from 'zod'

export const OrtsSchema = z.strictObject({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  geoLocation: z.array(z.number())
})

export const AufführungsSchema = z.strictObject({
  description: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: OrtsSchema,
  posterDownloadUrl: z.string().url()
})

export const RegistrierungsDetailsSchema = z.strictObject({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lateRegistration: z.boolean(),
  formPDFDownloadLink: z.string().url().min(1).optional(),
  confirmationText: z.string().min(1).optional()
})

export const EventDetailsSchema = z.strictObject({
  name: z.string().min(3, { message: 'Benötigt mindestens 3 Zeichen.' }),
  categoryId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  zielgruppe: z.string().min(1),
  location: OrtsSchema.optional()
})

export const EventSchema = z.strictObject({
  details: EventDetailsSchema,
  isPublished: z.boolean(),
  isCanceled: z.boolean(),
  workshopOffer: z.array(z.string().uuid()).optional(),
  alternativeProgram: z.array(z.string().uuid()).optional(),
  performance: AufführungsSchema.optional(),
  registration: RegistrierungsDetailsSchema.optional()
})

export const createVeranstaltungSchema = EventSchema.pick({
  details: true,
  isPublished: true,
  isCanceled: true,
  workshopOffer: true,
  alternativeProgram: true,
  performance: true,
  registration: true
})

export type Veranstaltung = z.infer<typeof EventSchema>
export type CreateVeranstaltungSchema = z.infer<typeof createVeranstaltungSchema>

export type VeranstaltungsDetails = z.infer<typeof EventDetailsSchema>
export type Ort = z.infer<typeof OrtsSchema>
export type Aufführung = z.infer<typeof AufführungsSchema>

export type RegistrierungsDetails = z.infer<typeof RegistrierungsDetailsSchema>
