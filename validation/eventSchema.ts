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
  fromPDFDownloadLink: z.string().url().min(1).nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  confirmationText: z.string().min(1).nullable(),
  externalLink: z.string().url().min(1).nullable(),
  lateRegistration: z.boolean(),
  singleRoomSurcharge: z.number(),
  participationFees: participationFeesSchema.nullable()
})

export const performanceSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().min(1),
  location: locationSchema,
  posterDownloadUrl: z.string().min(1),
  showOnEventPage: z.boolean()
})

export const eventSchema = z.object({
  id: z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  }).optional(),
  name: z.string().min(3, { message: 'Benötigt mindestens 3 Zeichen.' }),
  abbreviation: z.string().min(1, { message: 'Benötigt mindestens 3 Zeichen.' }),
  isDraft: z.boolean(),
  isCanceled: z.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string().min(1),
  categoryId: z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  }),
  location: locationSchema,
  workshopOffer: z.array(z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  })).optional(),
  alternativeProgram: z.array(z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  })).optional(),
  performance: performanceSchema.nullable(),
  registration: registrationSchema.nullable()
})

export type EventSchema = z.infer<typeof eventSchema>
export type RegistrationSchema = z.infer<typeof registrationSchema>
