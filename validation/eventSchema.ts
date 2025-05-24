import { z } from 'zod'

export const LocationSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  geoLocation: z.array(z.number())
})

export const PerformanceSchema = z.object({
  description: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: LocationSchema,
  posterDownloadUrl: z.string().url()
})

export const RegistrationDetailsSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lateRegistration: z.boolean(),
  formPDFDownloadLink: z.string().url().min(1).optional(),
  confirmationText: z.string().min(1).optional()
})

export const EventDetailsSchema = z.object({
  name: z.string().min(3, { message: 'Benötigt mindestens 3 Zeichen.' }),
  categoryId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string().min(1),
  location: LocationSchema.optional()
})

export const RbagEventSchema = z.object({
  details: EventDetailsSchema,
  isPublished: z.boolean(),
  isCanceled: z.boolean(),
  workshopOffer: z.array(z.string().uuid()).optional(),
  alternativeProgram: z.array(z.string().uuid()).optional(),
  performance: PerformanceSchema.optional(),
  registration: RegistrationDetailsSchema.optional()
})

export type RbagEvent = z.infer<typeof RbagEventSchema>

export type EventDetails = z.infer<typeof EventDetailsSchema>
export type Location = z.infer<typeof LocationSchema>
export type Performance = z.infer<typeof PerformanceSchema>

export type RegistrationDetails = z.infer<typeof RegistrationDetailsSchema>
