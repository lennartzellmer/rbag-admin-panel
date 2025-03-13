import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  geoLocation: z.array(z.number())
})

export const performanceSchema = z.object({
  description: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: locationSchema,
  posterDownloadUrl: z.string().url()
})

export const registrationSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lateRegistration: z.boolean(),
  formPDFDownloadLink: z.string().url().min(1).optional(),
  confirmationText: z.string().min(1).optional()
})

export const eventDetailsSchema = z.object({
  name: z.string().min(3, { message: 'Benötigt mindestens 3 Zeichen.' }),
  categoryId: z.string().uuid(),
  abbreviation: z.string().min(1, { message: 'Benötigt mindestens 3 Zeichen.' }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string().min(1),
  location: locationSchema.optional()
})

export const eventSchema = z.object({
  details: eventDetailsSchema,
  isPublished: z.boolean(),
  isCanceled: z.boolean(),
  workshopOffer: z.array(z.string().uuid()).optional(),
  alternativeProgram: z.array(z.string().uuid()).optional(),
  performance: performanceSchema.optional(),
  registration: registrationSchema.optional()
})

export type EventSchema = z.infer<typeof eventSchema>

export type EventDetailsSchema = z.infer<typeof eventDetailsSchema>
export type LocationSchema = z.infer<typeof locationSchema>
export type PerformanceSchema = z.infer<typeof performanceSchema>

export type RegistrationSchema = z.infer<typeof registrationSchema>
