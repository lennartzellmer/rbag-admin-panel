import { z } from 'zod'

export const participationFeesSchema = z.object({
  childrenAndYouth: z.number(),
  youngAdults: z.number(),
  youngAdultsMultiplier: z.number(),
  adults: z.number(),
  adultsMultiplier: z.number()
})

export const locationSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  geoLocation: z.array(z.number())
})

export const registrationSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lateRegistration: z.boolean(),

  // Optional fields
  singleRoomSurcharge: z.number().optional(),
  confirmationText: z.string().min(1).optional(),
  externalLink: z.string().url().min(1).optional(),
  participationFees: participationFeesSchema.optional(),
  fromPDFDownloadLink: z.string().url().min(1).optional()
})

export const performanceSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().min(1),
  location: locationSchema,
  posterDownloadUrl: z.string().min(1),
  showOnEventPage: z.boolean()
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
  workshopOffer: z.array(z.string().refine(val => val.match(/^[0-9a-fA-F]{24}$/))).optional(),
  alternativeProgram: z.array(z.string().refine(val => val.match(/^[0-9a-fA-F]{24}$/))).optional(),
  performance: performanceSchema.optional(),
  registration: registrationSchema.optional()
})

export type EventSchema = z.infer<typeof eventSchema>

export type EventDetailsSchema = z.infer<typeof eventDetailsSchema>
export type LocationSchema = z.infer<typeof locationSchema>
export type PerformanceSchema = z.infer<typeof performanceSchema>

export type RegistrationSchema = z.infer<typeof registrationSchema>
