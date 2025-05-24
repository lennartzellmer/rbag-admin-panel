import { z } from 'zod'

const DietaryPreferenceEnum = z.enum([
  'NO_PREFERENCE',
  'VEGETARIAN',
  'VEGAN'
])

const IntoleranceEnum = z.enum([
  'GLUTEN',
  'LACTOSE',
  'NUTS',
  'SHELLFISH',
  'EGGS',
  'SOY',
  'OTHER'
])

const DietaryRequirementsSchema = z.object({
  preference: DietaryPreferenceEnum.default('NO_PREFERENCE'),
  intolerances: z.array(IntoleranceEnum).default([]),
  additionalNotes: z.string().optional()
})

/**
 * Zod schema for ISO 3166-2:DE subdivision codes (German federal states)
 * Format: "DE-XX" where XX is the specific code for each federal state
 */
export const GermanFederalStateSchema = z.enum([
  'DE-BW', // Baden-Württemberg
  'DE-BY', // Bavaria (Bayern)
  'DE-BE', // Berlin
  'DE-BB', // Brandenburg
  'DE-HB', // Bremen
  'DE-HH', // Hamburg
  'DE-HE', // Hesse (Hessen)
  'DE-MV', // Mecklenburg-Western Pomerania (Mecklenburg-Vorpommern)
  'DE-NI', // Lower Saxony (Niedersachsen)
  'DE-NW', // North Rhine-Westphalia (Nordrhein-Westfalen)
  'DE-RP', // Rhineland-Palatinate (Rheinland-Pfalz)
  'DE-SL', // Saarland
  'DE-SN', // Saxony (Sachsen)
  'DE-ST', // Saxony-Anhalt (Sachsen-Anhalt)
  'DE-SH', // Schleswig-Holstein
  'DE-TH' // Thuringia (Thüringen)
])

const InternalCommentSchema = z.object({
  text: z.string().min(1),
  createdBy: z.string().min(1),
  createdAt: z.string().datetime()
})

export const AddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2)
})

export const RegistrationSchema = z.object({
  // Required fields
  eventId: z.string().uuid(),
  name: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Diverse']),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  address: AddressSchema,

  // Optional fields
  federalState: GermanFederalStateSchema.optional(),
  participantGroup: z.string().min(1).optional(),
  paymentReceived: z.boolean().default(false),
  consentForMediaRecording: z.boolean().default(false),
  dietaryRequirements: DietaryRequirementsSchema.optional(),

  isMultiplicator: z.boolean().default(false),
  multiplicatorReason: z.string().min(1).optional(),
  isReferent: z.boolean().default(false),

  singleRoomPerference: z.boolean().default(false),
  roomAssignmentPreferences: z.string().min(1).optional(),

  workshopBookings: z.array(z.string().uuid()).default([]),
  internalComments: z.array(InternalCommentSchema).default([])
})

export const RegistrationUpdateSchema = RegistrationSchema.partial()

export type DietaryRequirements = z.infer<typeof DietaryRequirementsSchema>
export type Registration = z.infer<typeof RegistrationSchema>
export type RegistrationUpdate = z.infer<typeof RegistrationUpdateSchema>
