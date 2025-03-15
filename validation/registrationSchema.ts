import { z } from 'zod'

export const AddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2)
})

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

const InternalCommentSchema = z.object({
  text: z.string().min(1),
  createdBy: z.string().min(1),
  createdAt: z.string().datetime()
})

export const RegistrationSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  address: AddressSchema,
  gender: z.enum(['Male', 'Female', 'Diverse']),
  federalState: z.string().min(1).optional(),
  participantGroup: z.string().min(1).optional(),
  paymentReceived: z.boolean().optional(),
  consentForMediaRecording: z.boolean().optional(),
  dietaryRequirements: DietaryRequirementsSchema,
  internalComments: z.array(InternalCommentSchema).default([]),

  isMultiplicator: z.boolean().optional(),
  multiplicatorReason: z.string().min(1).optional(),
  isReferent: z.boolean().optional(),

  singleRoomPerference: z.boolean().optional(),
  roomAssignmentPreferences: z.string().min(1).optional(),

  workshopBookings: z.array(z.string().uuid()).default([])
})

export type DietaryRequirements = z.infer<typeof DietaryRequirementsSchema>
export type Registration = z.infer<typeof RegistrationSchema>
