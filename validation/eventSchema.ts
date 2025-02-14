import { z } from 'zod'

const participationFeesSchema = z.object({
  childrenAndYouth: z.number(),
  youngAdults: z.number(),
  youngAdultsMultiplier: z.number(),
  adults: z.number(),
  adultsMultiplier: z.number()
})

const locationSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  geoLocation: z.array(z.number())
})

const registrationSchema = z.object({
  fromPDFDownloadLink: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  confirmationText: z.string().min(1),
  checkinOpen: z.boolean(),
  externalLink: z.string().min(1),
  lateRegistration: z.boolean(),
  singleRoomSurcharge: z.number(),
  participationFees: participationFeesSchema
}).optional()

const performanceSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().min(1),
  location: locationSchema,
  posterDownloadUrl: z.string().min(1),
  showOnEventPage: z.boolean()
}).optional()

export const eventSchema = z.object({
  name: z.string().min(1),
  status: z.enum([
    'DRAFT',
    'SAVE_THE_DATE',
    'REGISTRATION_SCHEDULED',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'COMPLETED',
    'CANCELED'
  ]),
  abbreviation: z.string().min(1),
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
  performance: performanceSchema.optional(),
  registration: registrationSchema.optional()
})
