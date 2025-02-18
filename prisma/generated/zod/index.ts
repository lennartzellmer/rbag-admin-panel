import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','description']);

export const WorkshopOfferScalarFieldEnumSchema = z.enum(['id','eventId','name','description','facilitatorId']);

export const FacilitatorScalarFieldEnumSchema = z.enum(['id','name','email','description']);

export const EventScalarFieldEnumSchema = z.enum(['id','name','status','abbreviation','startDate','endDate','targetGroupDescription','categoryId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const EventStatusSchema = z.enum(['DRAFT','SAVE_THE_DATE','REGISTRATION_SCHEDULED','REGISTRATION_OPEN','REGISTRATION_CLOSED','COMPLETED','CANCELED']);

export type EventStatusType = `${z.infer<typeof EventStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// WORKSHOP OFFER SCHEMA
/////////////////////////////////////////

export const WorkshopOfferSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string(),
})

export type WorkshopOffer = z.infer<typeof WorkshopOfferSchema>

/////////////////////////////////////////
// FACILITATOR SCHEMA
/////////////////////////////////////////

export const FacilitatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  description: z.string(),
})

export type Facilitator = z.infer<typeof FacilitatorSchema>

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  status: EventStatusSchema,
  id: z.string(),
  name: z.string(),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  categoryId: z.string(),
})

export type Event = z.infer<typeof EventSchema>

/////////////////////////////////////////
// COMPOSITE TYPES
/////////////////////////////////////////
// LOCATION
//------------------------------------------------------


/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  name: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  postalCode: z.string(),
  countryCode: z.string(),
  geoLocation: z.number().array(),
})

export type Location = z.infer<typeof LocationSchema>
// PERFORMANCE
//------------------------------------------------------


/////////////////////////////////////////
// PERFORMANCE SCHEMA
/////////////////////////////////////////

export const PerformanceSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string(),
  posterDownloadUrl: z.string().nullable(),
})

export type Performance = z.infer<typeof PerformanceSchema>
// REGISTRATION
//------------------------------------------------------


/////////////////////////////////////////
// REGISTRATION SCHEMA
/////////////////////////////////////////

export const RegistrationSchema = z.object({
  fromPDFDownloadLink: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  confirmationText: z.string(),
  checkinOpen: z.boolean(),
  externalLink: z.string(),
  lateRegistration: z.boolean(),
  singleRoomSurcharge: z.number(),
})

export type Registration = z.infer<typeof RegistrationSchema>
// PARTICIPATION FEES
//------------------------------------------------------


/////////////////////////////////////////
// PARTICIPATION FEES SCHEMA
/////////////////////////////////////////

export const ParticipationFeesSchema = z.object({
  childrenAndYouth: z.number(),
  youngAdults: z.number(),
  youngAdultsMultiplier: z.number(),
  adults: z.number(),
  adultsMultiplier: z.number(),
})

export type ParticipationFees = z.infer<typeof ParticipationFeesSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  events: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  events: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKSHOP OFFER
//------------------------------------------------------

export const WorkshopOfferIncludeSchema: z.ZodType<Prisma.WorkshopOfferInclude> = z.object({
}).strict()

export const WorkshopOfferArgsSchema: z.ZodType<Prisma.WorkshopOfferDefaultArgs> = z.object({
  select: z.lazy(() => WorkshopOfferSelectSchema).optional(),
  include: z.lazy(() => WorkshopOfferIncludeSchema).optional(),
}).strict();

export const WorkshopOfferSelectSchema: z.ZodType<Prisma.WorkshopOfferSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  facilitatorId: z.boolean().optional(),
  facilitator: z.union([z.boolean(),z.lazy(() => FacilitatorArgsSchema)]).optional(),
  eventAlternativeWorkshopOffers: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  eventWorkshopOffers: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

// FACILITATOR
//------------------------------------------------------

export const FacilitatorIncludeSchema: z.ZodType<Prisma.FacilitatorInclude> = z.object({
}).strict()

export const FacilitatorArgsSchema: z.ZodType<Prisma.FacilitatorDefaultArgs> = z.object({
  select: z.lazy(() => FacilitatorSelectSchema).optional(),
  include: z.lazy(() => FacilitatorIncludeSchema).optional(),
}).strict();

export const FacilitatorCountOutputTypeArgsSchema: z.ZodType<Prisma.FacilitatorCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FacilitatorCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FacilitatorCountOutputTypeSelectSchema: z.ZodType<Prisma.FacilitatorCountOutputTypeSelect> = z.object({
  workshopOffers: z.boolean().optional(),
}).strict();

export const FacilitatorSelectSchema: z.ZodType<Prisma.FacilitatorSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  description: z.boolean().optional(),
  workshopOffers: z.union([z.boolean(),z.lazy(() => WorkshopOfferArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FacilitatorCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVENT
//------------------------------------------------------

export const EventIncludeSchema: z.ZodType<Prisma.EventInclude> = z.object({
}).strict()

export const EventArgsSchema: z.ZodType<Prisma.EventDefaultArgs> = z.object({
  select: z.lazy(() => EventSelectSchema).optional(),
  include: z.lazy(() => EventIncludeSchema).optional(),
}).strict();

export const EventCountOutputTypeArgsSchema: z.ZodType<Prisma.EventCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EventCountOutputTypeSelectSchema: z.ZodType<Prisma.EventCountOutputTypeSelect> = z.object({
  workshopOffers: z.boolean().optional(),
  alternativeWorkshopOffers: z.boolean().optional(),
}).strict();

export const EventSelectSchema: z.ZodType<Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  status: z.boolean().optional(),
  abbreviation: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  targetGroupDescription: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  performance: z.union([z.boolean(),z.lazy(() => PerformanceArgsSchema)]).optional(),
  registration: z.union([z.boolean(),z.lazy(() => RegistrationArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  workshopOffers: z.union([z.boolean(),z.lazy(() => WorkshopOfferArgsSchema)]).optional(),
  alternativeWorkshopOffers: z.union([z.boolean(),z.lazy(() => WorkshopOfferArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  name: z.boolean().optional(),
  line1: z.boolean().optional(),
  line2: z.boolean().optional(),
  postalCode: z.boolean().optional(),
  countryCode: z.boolean().optional(),
  geoLocation: z.boolean().optional(),
}).strict()

// PERFORMANCE
//------------------------------------------------------

export const PerformanceIncludeSchema: z.ZodType<Prisma.PerformanceInclude> = z.object({
}).strict()

export const PerformanceArgsSchema: z.ZodType<Prisma.PerformanceDefaultArgs> = z.object({
  select: z.lazy(() => PerformanceSelectSchema).optional(),
  include: z.lazy(() => PerformanceIncludeSchema).optional(),
}).strict();

export const PerformanceSelectSchema: z.ZodType<Prisma.PerformanceSelect> = z.object({
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  description: z.boolean().optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  posterDownloadUrl: z.boolean().optional(),
}).strict()

// REGISTRATION
//------------------------------------------------------

export const RegistrationIncludeSchema: z.ZodType<Prisma.RegistrationInclude> = z.object({
}).strict()

export const RegistrationArgsSchema: z.ZodType<Prisma.RegistrationDefaultArgs> = z.object({
  select: z.lazy(() => RegistrationSelectSchema).optional(),
  include: z.lazy(() => RegistrationIncludeSchema).optional(),
}).strict();

export const RegistrationSelectSchema: z.ZodType<Prisma.RegistrationSelect> = z.object({
  fromPDFDownloadLink: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  confirmationText: z.boolean().optional(),
  checkinOpen: z.boolean().optional(),
  externalLink: z.boolean().optional(),
  lateRegistration: z.boolean().optional(),
  singleRoomSurcharge: z.boolean().optional(),
  participationFees: z.union([z.boolean(),z.lazy(() => ParticipationFeesArgsSchema)]).optional(),
}).strict()

// PARTICIPATION FEES
//------------------------------------------------------

export const ParticipationFeesArgsSchema: z.ZodType<Prisma.ParticipationFeesDefaultArgs> = z.object({
  select: z.lazy(() => ParticipationFeesSelectSchema).optional(),
}).strict();

export const ParticipationFeesSelectSchema: z.ZodType<Prisma.ParticipationFeesSelect> = z.object({
  childrenAndYouth: z.boolean().optional(),
  youngAdults: z.boolean().optional(),
  youngAdultsMultiplier: z.boolean().optional(),
  adults: z.boolean().optional(),
  adultsMultiplier: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  events: z.lazy(() => EventOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const WorkshopOfferWhereInputSchema: z.ZodType<Prisma.WorkshopOfferWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkshopOfferWhereInputSchema),z.lazy(() => WorkshopOfferWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkshopOfferWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkshopOfferWhereInputSchema),z.lazy(() => WorkshopOfferWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  facilitatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  facilitator: z.union([ z.lazy(() => FacilitatorScalarRelationFilterSchema),z.lazy(() => FacilitatorWhereInputSchema) ]).optional(),
  eventAlternativeWorkshopOffers: z.union([ z.lazy(() => EventScalarRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
  eventWorkshopOffers: z.union([ z.lazy(() => EventScalarRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkshopOfferOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  facilitatorId: z.lazy(() => SortOrderSchema).optional(),
  facilitator: z.lazy(() => FacilitatorOrderByWithRelationInputSchema).optional(),
  eventAlternativeWorkshopOffers: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  eventWorkshopOffers: z.lazy(() => EventOrderByWithRelationInputSchema).optional()
}).strict();

export const WorkshopOfferWhereUniqueInputSchema: z.ZodType<Prisma.WorkshopOfferWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => WorkshopOfferWhereInputSchema),z.lazy(() => WorkshopOfferWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkshopOfferWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkshopOfferWhereInputSchema),z.lazy(() => WorkshopOfferWhereInputSchema).array() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  facilitatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  facilitator: z.union([ z.lazy(() => FacilitatorScalarRelationFilterSchema),z.lazy(() => FacilitatorWhereInputSchema) ]).optional(),
  eventAlternativeWorkshopOffers: z.union([ z.lazy(() => EventScalarRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
  eventWorkshopOffers: z.union([ z.lazy(() => EventScalarRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict());

export const WorkshopOfferOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkshopOfferOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  facilitatorId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkshopOfferCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkshopOfferMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkshopOfferMinOrderByAggregateInputSchema).optional()
}).strict();

export const WorkshopOfferScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkshopOfferScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WorkshopOfferScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkshopOfferScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkshopOfferScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkshopOfferScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkshopOfferScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  facilitatorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const FacilitatorWhereInputSchema: z.ZodType<Prisma.FacilitatorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FacilitatorWhereInputSchema),z.lazy(() => FacilitatorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FacilitatorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FacilitatorWhereInputSchema),z.lazy(() => FacilitatorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional()
}).strict();

export const FacilitatorOrderByWithRelationInputSchema: z.ZodType<Prisma.FacilitatorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferOrderByRelationAggregateInputSchema).optional()
}).strict();

export const FacilitatorWhereUniqueInputSchema: z.ZodType<Prisma.FacilitatorWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => FacilitatorWhereInputSchema),z.lazy(() => FacilitatorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FacilitatorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FacilitatorWhereInputSchema),z.lazy(() => FacilitatorWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional()
}).strict());

export const FacilitatorOrderByWithAggregationInputSchema: z.ZodType<Prisma.FacilitatorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FacilitatorCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FacilitatorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FacilitatorMinOrderByAggregateInputSchema).optional()
}).strict();

export const FacilitatorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FacilitatorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FacilitatorScalarWhereWithAggregatesInputSchema),z.lazy(() => FacilitatorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FacilitatorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FacilitatorScalarWhereWithAggregatesInputSchema),z.lazy(() => FacilitatorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EventWhereInputSchema: z.ZodType<Prisma.EventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  targetGroupDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableCompositeFilterSchema),z.lazy(() => LocationObjectEqualityInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCompositeFilterSchema),z.lazy(() => PerformanceObjectEqualityInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCompositeFilterSchema),z.lazy(() => RegistrationObjectEqualityInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional()
}).strict();

export const EventOrderByWithRelationInputSchema: z.ZodType<Prisma.EventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  targetGroupDescription: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => LocationOrderByInputSchema).optional(),
  performance: z.lazy(() => PerformanceOrderByInputSchema).optional(),
  registration: z.lazy(() => RegistrationOrderByInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferOrderByRelationAggregateInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferOrderByRelationAggregateInputSchema).optional()
}).strict();

export const EventWhereUniqueInputSchema: z.ZodType<Prisma.EventWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  targetGroupDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableCompositeFilterSchema),z.lazy(() => LocationObjectEqualityInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCompositeFilterSchema),z.lazy(() => PerformanceObjectEqualityInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCompositeFilterSchema),z.lazy(() => RegistrationObjectEqualityInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferListRelationFilterSchema).optional()
}).strict());

export const EventOrderByWithAggregationInputSchema: z.ZodType<Prisma.EventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  targetGroupDescription: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EventCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EventMinOrderByAggregateInputSchema).optional()
}).strict();

export const EventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusWithAggregatesFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  targetGroupDescription: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  events: z.lazy(() => EventCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferCreateInputSchema: z.ZodType<Prisma.WorkshopOfferCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitator: z.lazy(() => FacilitatorCreateNestedOneWithoutWorkshopOffersInputSchema),
  eventAlternativeWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutWorkshopOffersInputSchema),
  eventWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutAlternativeWorkshopOffersInputSchema)
}).strict();

export const WorkshopOfferUncheckedCreateInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const WorkshopOfferUpdateInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitator: z.lazy(() => FacilitatorUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional(),
  eventAlternativeWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional(),
  eventWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutAlternativeWorkshopOffersNestedInputSchema).optional()
}).strict();

export const WorkshopOfferUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateInput> = z.object({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferCreateManyInputSchema: z.ZodType<Prisma.WorkshopOfferCreateManyInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const WorkshopOfferUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyInput> = z.object({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FacilitatorCreateInputSchema: z.ZodType<Prisma.FacilitatorCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  description: z.string(),
  workshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutFacilitatorInputSchema).optional()
}).strict();

export const FacilitatorUncheckedCreateInputSchema: z.ZodType<Prisma.FacilitatorUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  description: z.string(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutFacilitatorInputSchema).optional()
}).strict();

export const FacilitatorUpdateInputSchema: z.ZodType<Prisma.FacilitatorUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutFacilitatorNestedInputSchema).optional()
}).strict();

export const FacilitatorUncheckedUpdateInputSchema: z.ZodType<Prisma.FacilitatorUncheckedUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutFacilitatorNestedInputSchema).optional()
}).strict();

export const FacilitatorCreateManyInputSchema: z.ZodType<Prisma.FacilitatorCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  description: z.string()
}).strict();

export const FacilitatorUpdateManyMutationInputSchema: z.ZodType<Prisma.FacilitatorUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FacilitatorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FacilitatorUncheckedUpdateManyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventCreateInputSchema: z.ZodType<Prisma.EventCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutEventsInputSchema),
  workshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventUncheckedCreateInputSchema: z.ZodType<Prisma.EventUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  categoryId: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventUpdateInputSchema: z.ZodType<Prisma.EventUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateInputSchema: z.ZodType<Prisma.EventUncheckedUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventCreateManyInputSchema: z.ZodType<Prisma.EventCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  categoryId: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
}).strict();

export const EventUpdateManyMutationInputSchema: z.ZodType<Prisma.EventUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
}).strict();

export const EventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EventListRelationFilterSchema: z.ZodType<Prisma.EventListRelationFilter> = z.object({
  every: z.lazy(() => EventWhereInputSchema).optional(),
  some: z.lazy(() => EventWhereInputSchema).optional(),
  none: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const FacilitatorScalarRelationFilterSchema: z.ZodType<Prisma.FacilitatorScalarRelationFilter> = z.object({
  is: z.lazy(() => FacilitatorWhereInputSchema).optional(),
  isNot: z.lazy(() => FacilitatorWhereInputSchema).optional()
}).strict();

export const EventScalarRelationFilterSchema: z.ZodType<Prisma.EventScalarRelationFilter> = z.object({
  is: z.lazy(() => EventWhereInputSchema).optional(),
  isNot: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const WorkshopOfferCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkshopOfferCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  facilitatorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkshopOfferMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkshopOfferMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  facilitatorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkshopOfferMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkshopOfferMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  facilitatorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const WorkshopOfferListRelationFilterSchema: z.ZodType<Prisma.WorkshopOfferListRelationFilter> = z.object({
  every: z.lazy(() => WorkshopOfferWhereInputSchema).optional(),
  some: z.lazy(() => WorkshopOfferWhereInputSchema).optional(),
  none: z.lazy(() => WorkshopOfferWhereInputSchema).optional()
}).strict();

export const WorkshopOfferOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkshopOfferOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FacilitatorCountOrderByAggregateInputSchema: z.ZodType<Prisma.FacilitatorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FacilitatorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FacilitatorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FacilitatorMinOrderByAggregateInputSchema: z.ZodType<Prisma.FacilitatorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  isSet: z.boolean().optional()
}).strict();

export const EnumEventStatusFilterSchema: z.ZodType<Prisma.EnumEventStatusFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const LocationNullableCompositeFilterSchema: z.ZodType<Prisma.LocationNullableCompositeFilter> = z.object({
  equals: z.lazy(() => LocationObjectEqualityInputSchema).optional().nullable(),
  is: z.lazy(() => LocationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const LocationObjectEqualityInputSchema: z.ZodType<Prisma.LocationObjectEqualityInput> = z.object({
  name: z.string(),
  line1: z.string(),
  line2: z.string().optional().nullable(),
  postalCode: z.string(),
  countryCode: z.string(),
  geoLocation: z.number().array().optional()
}).strict();

export const PerformanceNullableCompositeFilterSchema: z.ZodType<Prisma.PerformanceNullableCompositeFilter> = z.object({
  equals: z.lazy(() => PerformanceObjectEqualityInputSchema).optional().nullable(),
  is: z.lazy(() => PerformanceWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PerformanceWhereInputSchema).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const PerformanceObjectEqualityInputSchema: z.ZodType<Prisma.PerformanceObjectEqualityInput> = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string(),
  location: z.lazy(() => LocationObjectEqualityInputSchema),
  posterDownloadUrl: z.string().optional().nullable()
}).strict();

export const RegistrationNullableCompositeFilterSchema: z.ZodType<Prisma.RegistrationNullableCompositeFilter> = z.object({
  equals: z.lazy(() => RegistrationObjectEqualityInputSchema).optional().nullable(),
  is: z.lazy(() => RegistrationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => RegistrationWhereInputSchema).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const RegistrationObjectEqualityInputSchema: z.ZodType<Prisma.RegistrationObjectEqualityInput> = z.object({
  fromPDFDownloadLink: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  confirmationText: z.string(),
  checkinOpen: z.boolean(),
  externalLink: z.string(),
  lateRegistration: z.boolean(),
  singleRoomSurcharge: z.number(),
  participationFees: z.lazy(() => ParticipationFeesObjectEqualityInputSchema)
}).strict();

export const CategoryScalarRelationFilterSchema: z.ZodType<Prisma.CategoryScalarRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const LocationOrderByInputSchema: z.ZodType<Prisma.LocationOrderByInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  line1: z.lazy(() => SortOrderSchema).optional(),
  line2: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  countryCode: z.lazy(() => SortOrderSchema).optional(),
  geoLocation: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PerformanceOrderByInputSchema: z.ZodType<Prisma.PerformanceOrderByInput> = z.object({
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => LocationOrderByInputSchema).optional(),
  posterDownloadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RegistrationOrderByInputSchema: z.ZodType<Prisma.RegistrationOrderByInput> = z.object({
  fromPDFDownloadLink: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  confirmationText: z.lazy(() => SortOrderSchema).optional(),
  checkinOpen: z.lazy(() => SortOrderSchema).optional(),
  externalLink: z.lazy(() => SortOrderSchema).optional(),
  lateRegistration: z.lazy(() => SortOrderSchema).optional(),
  singleRoomSurcharge: z.lazy(() => SortOrderSchema).optional(),
  participationFees: z.lazy(() => ParticipationFeesOrderByInputSchema).optional()
}).strict();

export const EventCountOrderByAggregateInputSchema: z.ZodType<Prisma.EventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  targetGroupDescription: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  targetGroupDescription: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMinOrderByAggregateInputSchema: z.ZodType<Prisma.EventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  targetGroupDescription: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEventStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEventStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventStatusFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EventCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.EventCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventCreateWithoutCategoryInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.EventUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventCreateWithoutCategoryInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const EventUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.EventUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventCreateWithoutCategoryInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventCreateWithoutCategoryInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => EventCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FacilitatorCreateNestedOneWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorCreateNestedOneWithoutWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => FacilitatorCreateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedCreateWithoutWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FacilitatorCreateOrConnectWithoutWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => FacilitatorWhereUniqueInputSchema).optional()
}).strict();

export const EventCreateNestedOneWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional()
}).strict();

export const EventCreateNestedOneWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutAlternativeWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutAlternativeWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutAlternativeWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional()
}).strict();

export const FacilitatorUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema: z.ZodType<Prisma.FacilitatorUpdateOneRequiredWithoutWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => FacilitatorCreateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedCreateWithoutWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FacilitatorCreateOrConnectWithoutWorkshopOffersInputSchema).optional(),
  upsert: z.lazy(() => FacilitatorUpsertWithoutWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => FacilitatorWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FacilitatorUpdateToOneWithWhereWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedUpdateWithoutWorkshopOffersInputSchema) ]).optional(),
}).strict();

export const EventUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutWorkshopOffersInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutWorkshopOffersInputSchema),z.lazy(() => EventUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutWorkshopOffersInputSchema) ]).optional(),
}).strict();

export const EventUpdateOneRequiredWithoutAlternativeWorkshopOffersNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutAlternativeWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutAlternativeWorkshopOffersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutAlternativeWorkshopOffersInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutAlternativeWorkshopOffersInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUpdateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutAlternativeWorkshopOffersInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferCreateNestedManyWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferCreateNestedManyWithoutFacilitatorInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyFacilitatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedCreateNestedManyWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateNestedManyWithoutFacilitatorInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyFacilitatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable(),
  unset: z.boolean().optional()
}).strict();

export const WorkshopOfferUpdateManyWithoutFacilitatorNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithoutFacilitatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyFacilitatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutFacilitatorNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutFacilitatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyFacilitatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationNullableCreateEnvelopeInputSchema: z.ZodType<Prisma.LocationNullableCreateEnvelopeInput> = z.object({
  set: z.lazy(() => LocationCreateInputSchema).optional().nullable()
}).strict();

export const LocationCreateInputSchema: z.ZodType<Prisma.LocationCreateInput> = z.object({
  name: z.string(),
  line1: z.string(),
  line2: z.string().optional().nullable(),
  postalCode: z.string(),
  countryCode: z.string(),
  geoLocation: z.union([ z.lazy(() => LocationCreategeoLocationInputSchema),z.number().array() ]).optional(),
}).strict();

export const PerformanceNullableCreateEnvelopeInputSchema: z.ZodType<Prisma.PerformanceNullableCreateEnvelopeInput> = z.object({
  set: z.lazy(() => PerformanceCreateInputSchema).optional().nullable()
}).strict();

export const PerformanceCreateInputSchema: z.ZodType<Prisma.PerformanceCreateInput> = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string(),
  location: z.lazy(() => LocationCreateInputSchema),
  posterDownloadUrl: z.string().optional().nullable()
}).strict();

export const RegistrationNullableCreateEnvelopeInputSchema: z.ZodType<Prisma.RegistrationNullableCreateEnvelopeInput> = z.object({
  set: z.lazy(() => RegistrationCreateInputSchema).optional().nullable()
}).strict();

export const RegistrationCreateInputSchema: z.ZodType<Prisma.RegistrationCreateInput> = z.object({
  fromPDFDownloadLink: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  confirmationText: z.string(),
  checkinOpen: z.boolean(),
  externalLink: z.string(),
  lateRegistration: z.boolean(),
  singleRoomSurcharge: z.number(),
  participationFees: z.lazy(() => ParticipationFeesCreateInputSchema)
}).strict();

export const CategoryCreateNestedOneWithoutEventsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutEventsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const WorkshopOfferCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateNestedManyWithoutEventAlternativeWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferCreateNestedManyWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateNestedManyWithoutEventWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateNestedManyWithoutEventAlternativeWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedCreateNestedManyWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateNestedManyWithoutEventWorkshopOffersInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumEventStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEventStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EventStatusSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const LocationNullableUpdateEnvelopeInputSchema: z.ZodType<Prisma.LocationNullableUpdateEnvelopeInput> = z.object({
  set: z.lazy(() => LocationCreateInputSchema).optional().nullable(),
  upsert: z.lazy(() => LocationUpsertInputSchema).optional(),
  unset: z.boolean().optional()
}).strict();

export const PerformanceNullableUpdateEnvelopeInputSchema: z.ZodType<Prisma.PerformanceNullableUpdateEnvelopeInput> = z.object({
  set: z.lazy(() => PerformanceCreateInputSchema).optional().nullable(),
  upsert: z.lazy(() => PerformanceUpsertInputSchema).optional(),
  unset: z.boolean().optional()
}).strict();

export const RegistrationNullableUpdateEnvelopeInputSchema: z.ZodType<Prisma.RegistrationNullableUpdateEnvelopeInput> = z.object({
  set: z.lazy(() => RegistrationCreateInputSchema).optional().nullable(),
  upsert: z.lazy(() => RegistrationUpsertInputSchema).optional(),
  unset: z.boolean().optional()
}).strict();

export const CategoryUpdateOneRequiredWithoutEventsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutEventsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutEventsInputSchema),z.lazy(() => CategoryUpdateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutEventsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithoutEventAlternativeWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUpdateManyWithoutEventWorkshopOffersNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithoutEventWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersNestedInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema).array(),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkshopOfferWhereUniqueInputSchema),z.lazy(() => WorkshopOfferWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  isSet: z.boolean().optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional()
}).strict();

export const NestedEnumEventStatusFilterSchema: z.ZodType<Prisma.NestedEnumEventStatusFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  line1: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  line2: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  postalCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  geoLocation: z.lazy(() => FloatNullableListFilterSchema).optional()
}).strict();

export const PerformanceWhereInputSchema: z.ZodType<Prisma.PerformanceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PerformanceWhereInputSchema),z.lazy(() => PerformanceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PerformanceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PerformanceWhereInputSchema),z.lazy(() => PerformanceWhereInputSchema).array() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => LocationCompositeFilterSchema),z.lazy(() => LocationObjectEqualityInputSchema) ]).optional(),
  posterDownloadUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const RegistrationWhereInputSchema: z.ZodType<Prisma.RegistrationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RegistrationWhereInputSchema),z.lazy(() => RegistrationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RegistrationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RegistrationWhereInputSchema),z.lazy(() => RegistrationWhereInputSchema).array() ]).optional(),
  fromPDFDownloadLink: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  confirmationText: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  checkinOpen: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  externalLink: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lateRegistration: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  singleRoomSurcharge: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  participationFees: z.union([ z.lazy(() => ParticipationFeesCompositeFilterSchema),z.lazy(() => ParticipationFeesObjectEqualityInputSchema) ]).optional(),
}).strict();

export const ParticipationFeesObjectEqualityInputSchema: z.ZodType<Prisma.ParticipationFeesObjectEqualityInput> = z.object({
  childrenAndYouth: z.number(),
  youngAdults: z.number(),
  youngAdultsMultiplier: z.number(),
  adults: z.number(),
  adultsMultiplier: z.number()
}).strict();

export const ParticipationFeesOrderByInputSchema: z.ZodType<Prisma.ParticipationFeesOrderByInput> = z.object({
  childrenAndYouth: z.lazy(() => SortOrderSchema).optional(),
  youngAdults: z.lazy(() => SortOrderSchema).optional(),
  youngAdultsMultiplier: z.lazy(() => SortOrderSchema).optional(),
  adults: z.lazy(() => SortOrderSchema).optional(),
  adultsMultiplier: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NestedEnumEventStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEventStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventStatusFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EventCreateWithoutCategoryInputSchema: z.ZodType<Prisma.EventCreateWithoutCategoryInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const EventCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EventCreateManyCategoryInputSchema),z.lazy(() => EventCreateManyCategoryInputSchema).array() ]),
}).strict();

export const EventUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const EventUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutCategoryInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const EventUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema),z.lazy(() => EventUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const EventScalarWhereInputSchema: z.ZodType<Prisma.EventScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  targetGroupDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const FacilitatorCreateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorCreateWithoutWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  description: z.string()
}).strict();

export const FacilitatorUncheckedCreateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorUncheckedCreateWithoutWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  description: z.string()
}).strict();

export const FacilitatorCreateOrConnectWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorCreateOrConnectWithoutWorkshopOffersInput> = z.object({
  where: z.lazy(() => FacilitatorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FacilitatorCreateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedCreateWithoutWorkshopOffersInputSchema) ]),
}).strict();

export const EventCreateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateWithoutWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutEventsInputSchema),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  categoryId: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventWorkshopOffersInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutWorkshopOffersInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutWorkshopOffersInputSchema) ]),
}).strict();

export const EventCreateWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateWithoutAlternativeWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutEventsInputSchema),
  workshopOffers: z.lazy(() => WorkshopOfferCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutAlternativeWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  categoryId: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedCreateNestedManyWithoutEventAlternativeWorkshopOffersInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const FacilitatorUpsertWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorUpsertWithoutWorkshopOffersInput> = z.object({
  update: z.union([ z.lazy(() => FacilitatorUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedUpdateWithoutWorkshopOffersInputSchema) ]),
  create: z.union([ z.lazy(() => FacilitatorCreateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedCreateWithoutWorkshopOffersInputSchema) ]),
  where: z.lazy(() => FacilitatorWhereInputSchema).optional()
}).strict();

export const FacilitatorUpdateToOneWithWhereWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorUpdateToOneWithWhereWithoutWorkshopOffersInput> = z.object({
  where: z.lazy(() => FacilitatorWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FacilitatorUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => FacilitatorUncheckedUpdateWithoutWorkshopOffersInputSchema) ]),
}).strict();

export const FacilitatorUpdateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorUpdateWithoutWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FacilitatorUncheckedUpdateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.FacilitatorUncheckedUpdateWithoutWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventUpsertWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpsertWithoutWorkshopOffersInput> = z.object({
  update: z.union([ z.lazy(() => EventUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutWorkshopOffersInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutWorkshopOffersInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventUpdateToOneWithWhereWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutWorkshopOffersInput> = z.object({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutWorkshopOffersInputSchema) ]),
}).strict();

export const EventUpdateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpdateWithoutWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutWorkshopOffersInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUpsertWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpsertWithoutAlternativeWorkshopOffersInput> = z.object({
  update: z.union([ z.lazy(() => EventUpdateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutAlternativeWorkshopOffersInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedCreateWithoutAlternativeWorkshopOffersInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventUpdateToOneWithWhereWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutAlternativeWorkshopOffersInputSchema),z.lazy(() => EventUncheckedUpdateWithoutAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const EventUpdateWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventUpdateWithoutAlternativeWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  workshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutAlternativeWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional()
}).strict();

export const WorkshopOfferCreateWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferCreateWithoutFacilitatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  eventAlternativeWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutWorkshopOffersInputSchema),
  eventWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutAlternativeWorkshopOffersInputSchema)
}).strict();

export const WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateWithoutFacilitatorInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string(),
  description: z.string()
}).strict();

export const WorkshopOfferCreateOrConnectWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferCreateOrConnectWithoutFacilitatorInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema) ]),
}).strict();

export const WorkshopOfferCreateManyFacilitatorInputEnvelopeSchema: z.ZodType<Prisma.WorkshopOfferCreateManyFacilitatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkshopOfferCreateManyFacilitatorInputSchema),z.lazy(() => WorkshopOfferCreateManyFacilitatorInputSchema).array() ]),
}).strict();

export const WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUpsertWithWhereUniqueWithoutFacilitatorInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutFacilitatorInputSchema) ]),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutFacilitatorInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithWhereUniqueWithoutFacilitatorInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutFacilitatorInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutFacilitatorInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithWhereWithoutFacilitatorInput> = z.object({
  where: z.lazy(() => WorkshopOfferScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateManyMutationInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutFacilitatorInputSchema) ]),
}).strict();

export const WorkshopOfferScalarWhereInputSchema: z.ZodType<Prisma.WorkshopOfferScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkshopOfferScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkshopOfferScalarWhereInputSchema),z.lazy(() => WorkshopOfferScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  facilitatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const LocationCreategeoLocationInputSchema: z.ZodType<Prisma.LocationCreategeoLocationInput> = z.object({
  set: z.number().array()
}).strict();

export const ParticipationFeesCreateInputSchema: z.ZodType<Prisma.ParticipationFeesCreateInput> = z.object({
  childrenAndYouth: z.number(),
  youngAdults: z.number(),
  youngAdultsMultiplier: z.number(),
  adults: z.number(),
  adultsMultiplier: z.number()
}).strict();

export const CategoryCreateWithoutEventsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string()
}).strict();

export const CategoryUncheckedCreateWithoutEventsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string()
}).strict();

export const CategoryCreateOrConnectWithoutEventsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutEventsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutEventsInputSchema) ]),
}).strict();

export const WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitator: z.lazy(() => FacilitatorCreateNestedOneWithoutWorkshopOffersInputSchema),
  eventWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutAlternativeWorkshopOffersInputSchema)
}).strict();

export const WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateOrConnectWithoutEventAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelopeSchema: z.ZodType<Prisma.WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputSchema).array() ]),
}).strict();

export const WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateWithoutEventWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitator: z.lazy(() => FacilitatorCreateNestedOneWithoutWorkshopOffersInputSchema),
  eventAlternativeWorkshopOffers: z.lazy(() => EventCreateNestedOneWithoutWorkshopOffersInputSchema)
}).strict();

export const WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateOrConnectWithoutEventWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferCreateManyEventWorkshopOffersInputEnvelopeSchema: z.ZodType<Prisma.WorkshopOfferCreateManyEventWorkshopOffersInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferCreateManyEventWorkshopOffersInputSchema).array() ]),
}).strict();

export const LocationUpsertInputSchema: z.ZodType<Prisma.LocationUpsertInput> = z.object({
  set: z.lazy(() => LocationCreateInputSchema).nullable(),
  update: z.lazy(() => LocationUpdateInputSchema)
}).strict();

export const PerformanceUpsertInputSchema: z.ZodType<Prisma.PerformanceUpsertInput> = z.object({
  set: z.lazy(() => PerformanceCreateInputSchema).nullable(),
  update: z.lazy(() => PerformanceUpdateInputSchema)
}).strict();

export const RegistrationUpsertInputSchema: z.ZodType<Prisma.RegistrationUpsertInput> = z.object({
  set: z.lazy(() => RegistrationCreateInputSchema).nullable(),
  update: z.lazy(() => RegistrationUpdateInputSchema)
}).strict();

export const CategoryUpsertWithoutEventsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutEventsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutEventsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutEventsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutEventsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutEventsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutEventsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutEventsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutEventsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutEventsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateWithoutEventsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutEventsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpsertWithWhereUniqueWithoutEventAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutEventAlternativeWorkshopOffersInputSchema) ]),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithWhereUniqueWithoutEventAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutEventAlternativeWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutEventAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithWhereWithoutEventAlternativeWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateManyMutationInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpsertWithWhereUniqueWithoutEventWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutEventWorkshopOffersInputSchema) ]),
  create: z.union([ z.lazy(() => WorkshopOfferCreateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedCreateWithoutEventWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithWhereUniqueWithoutEventWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateWithoutEventWorkshopOffersInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateWithoutEventWorkshopOffersInputSchema) ]),
}).strict();

export const WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyWithWhereWithoutEventWorkshopOffersInput> = z.object({
  where: z.lazy(() => WorkshopOfferScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkshopOfferUpdateManyMutationInputSchema),z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersInputSchema) ]),
}).strict();

export const FloatNullableListFilterSchema: z.ZodType<Prisma.FloatNullableListFilter> = z.object({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const LocationCompositeFilterSchema: z.ZodType<Prisma.LocationCompositeFilter> = z.object({
  equals: z.lazy(() => LocationObjectEqualityInputSchema).optional(),
  is: z.lazy(() => LocationWhereInputSchema).optional(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const ParticipationFeesCompositeFilterSchema: z.ZodType<Prisma.ParticipationFeesCompositeFilter> = z.object({
  equals: z.lazy(() => ParticipationFeesObjectEqualityInputSchema).optional(),
  is: z.lazy(() => ParticipationFeesWhereInputSchema).optional(),
  isNot: z.lazy(() => ParticipationFeesWhereInputSchema).optional()
}).strict();

export const EventCreateManyCategoryInputSchema: z.ZodType<Prisma.EventCreateManyCategoryInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.lazy(() => EventStatusSchema),
  abbreviation: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetGroupDescription: z.string(),
  location: z.union([ z.lazy(() => LocationNullableCreateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableCreateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableCreateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
}).strict();

export const EventUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.EventUpdateWithoutCategoryInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutCategoryInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
  workshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersNestedInputSchema).optional(),
  alternativeWorkshopOffers: z.lazy(() => WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCategoryInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  targetGroupDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional().nullable(),
  performance: z.union([ z.lazy(() => PerformanceNullableUpdateEnvelopeInputSchema),z.lazy(() => PerformanceCreateInputSchema) ]).optional().nullable(),
  registration: z.union([ z.lazy(() => RegistrationNullableUpdateEnvelopeInputSchema),z.lazy(() => RegistrationCreateInputSchema) ]).optional().nullable(),
}).strict();

export const WorkshopOfferCreateManyFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferCreateManyFacilitatorInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string(),
  description: z.string()
}).strict();

export const WorkshopOfferUpdateWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithoutFacilitatorInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventAlternativeWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional(),
  eventWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutAlternativeWorkshopOffersNestedInputSchema).optional()
}).strict();

export const WorkshopOfferUncheckedUpdateWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateWithoutFacilitatorInput> = z.object({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutFacilitatorInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutFacilitatorInput> = z.object({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferCreateManyEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateManyEventAlternativeWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const WorkshopOfferCreateManyEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferCreateManyEventWorkshopOffersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  facilitatorId: z.string()
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  line1: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  line2: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countryCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geoLocation: z.union([ z.lazy(() => LocationUpdategeoLocationInputSchema),z.number().array() ]).optional(),
}).strict();

export const PerformanceUpdateInputSchema: z.ZodType<Prisma.PerformanceUpdateInput> = z.object({
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationUpdateEnvelopeInputSchema),z.lazy(() => LocationCreateInputSchema) ]).optional(),
  posterDownloadUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RegistrationUpdateInputSchema: z.ZodType<Prisma.RegistrationUpdateInput> = z.object({
  fromPDFDownloadLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  confirmationText: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkinOpen: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  externalLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lateRegistration: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  singleRoomSurcharge: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  participationFees: z.union([ z.lazy(() => ParticipationFeesUpdateEnvelopeInputSchema),z.lazy(() => ParticipationFeesCreateInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUpdateWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithoutEventAlternativeWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitator: z.lazy(() => FacilitatorUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional(),
  eventWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutAlternativeWorkshopOffersNestedInputSchema).optional()
}).strict();

export const WorkshopOfferUncheckedUpdateWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateWithoutEventAlternativeWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutEventAlternativeWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUpdateWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUpdateWithoutEventWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitator: z.lazy(() => FacilitatorUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional(),
  eventAlternativeWorkshopOffers: z.lazy(() => EventUpdateOneRequiredWithoutWorkshopOffersNestedInputSchema).optional()
}).strict();

export const WorkshopOfferUncheckedUpdateWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateWithoutEventWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersInputSchema: z.ZodType<Prisma.WorkshopOfferUncheckedUpdateManyWithoutEventWorkshopOffersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  facilitatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const ParticipationFeesWhereInputSchema: z.ZodType<Prisma.ParticipationFeesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipationFeesWhereInputSchema),z.lazy(() => ParticipationFeesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipationFeesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipationFeesWhereInputSchema),z.lazy(() => ParticipationFeesWhereInputSchema).array() ]).optional(),
  childrenAndYouth: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  youngAdults: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  youngAdultsMultiplier: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  adults: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  adultsMultiplier: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
}).strict();

export const LocationUpdategeoLocationInputSchema: z.ZodType<Prisma.LocationUpdategeoLocationInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const LocationUpdateEnvelopeInputSchema: z.ZodType<Prisma.LocationUpdateEnvelopeInput> = z.object({
  set: z.lazy(() => LocationCreateInputSchema).optional(),
  update: z.lazy(() => LocationUpdateInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ParticipationFeesUpdateEnvelopeInputSchema: z.ZodType<Prisma.ParticipationFeesUpdateEnvelopeInput> = z.object({
  set: z.lazy(() => ParticipationFeesCreateInputSchema).optional(),
  update: z.lazy(() => ParticipationFeesUpdateInputSchema).optional()
}).strict();

export const ParticipationFeesUpdateInputSchema: z.ZodType<Prisma.ParticipationFeesUpdateInput> = z.object({
  childrenAndYouth: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  youngAdults: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  youngAdultsMultiplier: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  adults: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  adultsMultiplier: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const WorkshopOfferFindFirstArgsSchema: z.ZodType<Prisma.WorkshopOfferFindFirstArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereInputSchema.optional(),
  orderBy: z.union([ WorkshopOfferOrderByWithRelationInputSchema.array(),WorkshopOfferOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkshopOfferWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkshopOfferScalarFieldEnumSchema,WorkshopOfferScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkshopOfferFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkshopOfferFindFirstOrThrowArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereInputSchema.optional(),
  orderBy: z.union([ WorkshopOfferOrderByWithRelationInputSchema.array(),WorkshopOfferOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkshopOfferWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkshopOfferScalarFieldEnumSchema,WorkshopOfferScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkshopOfferFindManyArgsSchema: z.ZodType<Prisma.WorkshopOfferFindManyArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereInputSchema.optional(),
  orderBy: z.union([ WorkshopOfferOrderByWithRelationInputSchema.array(),WorkshopOfferOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkshopOfferWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkshopOfferScalarFieldEnumSchema,WorkshopOfferScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkshopOfferAggregateArgsSchema: z.ZodType<Prisma.WorkshopOfferAggregateArgs> = z.object({
  where: WorkshopOfferWhereInputSchema.optional(),
  orderBy: z.union([ WorkshopOfferOrderByWithRelationInputSchema.array(),WorkshopOfferOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkshopOfferWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkshopOfferGroupByArgsSchema: z.ZodType<Prisma.WorkshopOfferGroupByArgs> = z.object({
  where: WorkshopOfferWhereInputSchema.optional(),
  orderBy: z.union([ WorkshopOfferOrderByWithAggregationInputSchema.array(),WorkshopOfferOrderByWithAggregationInputSchema ]).optional(),
  by: WorkshopOfferScalarFieldEnumSchema.array(),
  having: WorkshopOfferScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkshopOfferFindUniqueArgsSchema: z.ZodType<Prisma.WorkshopOfferFindUniqueArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereUniqueInputSchema,
}).strict() ;

export const WorkshopOfferFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkshopOfferFindUniqueOrThrowArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereUniqueInputSchema,
}).strict() ;

export const FacilitatorFindFirstArgsSchema: z.ZodType<Prisma.FacilitatorFindFirstArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereInputSchema.optional(),
  orderBy: z.union([ FacilitatorOrderByWithRelationInputSchema.array(),FacilitatorOrderByWithRelationInputSchema ]).optional(),
  cursor: FacilitatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FacilitatorScalarFieldEnumSchema,FacilitatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FacilitatorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FacilitatorFindFirstOrThrowArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereInputSchema.optional(),
  orderBy: z.union([ FacilitatorOrderByWithRelationInputSchema.array(),FacilitatorOrderByWithRelationInputSchema ]).optional(),
  cursor: FacilitatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FacilitatorScalarFieldEnumSchema,FacilitatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FacilitatorFindManyArgsSchema: z.ZodType<Prisma.FacilitatorFindManyArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereInputSchema.optional(),
  orderBy: z.union([ FacilitatorOrderByWithRelationInputSchema.array(),FacilitatorOrderByWithRelationInputSchema ]).optional(),
  cursor: FacilitatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FacilitatorScalarFieldEnumSchema,FacilitatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FacilitatorAggregateArgsSchema: z.ZodType<Prisma.FacilitatorAggregateArgs> = z.object({
  where: FacilitatorWhereInputSchema.optional(),
  orderBy: z.union([ FacilitatorOrderByWithRelationInputSchema.array(),FacilitatorOrderByWithRelationInputSchema ]).optional(),
  cursor: FacilitatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FacilitatorGroupByArgsSchema: z.ZodType<Prisma.FacilitatorGroupByArgs> = z.object({
  where: FacilitatorWhereInputSchema.optional(),
  orderBy: z.union([ FacilitatorOrderByWithAggregationInputSchema.array(),FacilitatorOrderByWithAggregationInputSchema ]).optional(),
  by: FacilitatorScalarFieldEnumSchema.array(),
  having: FacilitatorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FacilitatorFindUniqueArgsSchema: z.ZodType<Prisma.FacilitatorFindUniqueArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereUniqueInputSchema,
}).strict() ;

export const FacilitatorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FacilitatorFindUniqueOrThrowArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereUniqueInputSchema,
}).strict() ;

export const EventFindFirstArgsSchema: z.ZodType<Prisma.EventFindFirstArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EventFindFirstOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindManyArgsSchema: z.ZodType<Prisma.EventFindManyArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventAggregateArgsSchema: z.ZodType<Prisma.EventAggregateArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventGroupByArgsSchema: z.ZodType<Prisma.EventGroupByArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithAggregationInputSchema.array(),EventOrderByWithAggregationInputSchema ]).optional(),
  by: EventScalarFieldEnumSchema.array(),
  having: EventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventFindUniqueArgsSchema: z.ZodType<Prisma.EventFindUniqueArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EventFindUniqueOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const WorkshopOfferCreateArgsSchema: z.ZodType<Prisma.WorkshopOfferCreateArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  data: z.union([ WorkshopOfferCreateInputSchema,WorkshopOfferUncheckedCreateInputSchema ]),
}).strict() ;

export const WorkshopOfferUpsertArgsSchema: z.ZodType<Prisma.WorkshopOfferUpsertArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereUniqueInputSchema,
  create: z.union([ WorkshopOfferCreateInputSchema,WorkshopOfferUncheckedCreateInputSchema ]),
  update: z.union([ WorkshopOfferUpdateInputSchema,WorkshopOfferUncheckedUpdateInputSchema ]),
}).strict() ;

export const WorkshopOfferCreateManyArgsSchema: z.ZodType<Prisma.WorkshopOfferCreateManyArgs> = z.object({
  data: z.union([ WorkshopOfferCreateManyInputSchema,WorkshopOfferCreateManyInputSchema.array() ]),
}).strict() ;

export const WorkshopOfferDeleteArgsSchema: z.ZodType<Prisma.WorkshopOfferDeleteArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  where: WorkshopOfferWhereUniqueInputSchema,
}).strict() ;

export const WorkshopOfferUpdateArgsSchema: z.ZodType<Prisma.WorkshopOfferUpdateArgs> = z.object({
  select: WorkshopOfferSelectSchema.optional(),
  include: WorkshopOfferIncludeSchema.optional(),
  data: z.union([ WorkshopOfferUpdateInputSchema,WorkshopOfferUncheckedUpdateInputSchema ]),
  where: WorkshopOfferWhereUniqueInputSchema,
}).strict() ;

export const WorkshopOfferUpdateManyArgsSchema: z.ZodType<Prisma.WorkshopOfferUpdateManyArgs> = z.object({
  data: z.union([ WorkshopOfferUpdateManyMutationInputSchema,WorkshopOfferUncheckedUpdateManyInputSchema ]),
  where: WorkshopOfferWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const WorkshopOfferDeleteManyArgsSchema: z.ZodType<Prisma.WorkshopOfferDeleteManyArgs> = z.object({
  where: WorkshopOfferWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const FacilitatorCreateArgsSchema: z.ZodType<Prisma.FacilitatorCreateArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  data: z.union([ FacilitatorCreateInputSchema,FacilitatorUncheckedCreateInputSchema ]),
}).strict() ;

export const FacilitatorUpsertArgsSchema: z.ZodType<Prisma.FacilitatorUpsertArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereUniqueInputSchema,
  create: z.union([ FacilitatorCreateInputSchema,FacilitatorUncheckedCreateInputSchema ]),
  update: z.union([ FacilitatorUpdateInputSchema,FacilitatorUncheckedUpdateInputSchema ]),
}).strict() ;

export const FacilitatorCreateManyArgsSchema: z.ZodType<Prisma.FacilitatorCreateManyArgs> = z.object({
  data: z.union([ FacilitatorCreateManyInputSchema,FacilitatorCreateManyInputSchema.array() ]),
}).strict() ;

export const FacilitatorDeleteArgsSchema: z.ZodType<Prisma.FacilitatorDeleteArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  where: FacilitatorWhereUniqueInputSchema,
}).strict() ;

export const FacilitatorUpdateArgsSchema: z.ZodType<Prisma.FacilitatorUpdateArgs> = z.object({
  select: FacilitatorSelectSchema.optional(),
  include: FacilitatorIncludeSchema.optional(),
  data: z.union([ FacilitatorUpdateInputSchema,FacilitatorUncheckedUpdateInputSchema ]),
  where: FacilitatorWhereUniqueInputSchema,
}).strict() ;

export const FacilitatorUpdateManyArgsSchema: z.ZodType<Prisma.FacilitatorUpdateManyArgs> = z.object({
  data: z.union([ FacilitatorUpdateManyMutationInputSchema,FacilitatorUncheckedUpdateManyInputSchema ]),
  where: FacilitatorWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const FacilitatorDeleteManyArgsSchema: z.ZodType<Prisma.FacilitatorDeleteManyArgs> = z.object({
  where: FacilitatorWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EventCreateArgsSchema: z.ZodType<Prisma.EventCreateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
}).strict() ;

export const EventUpsertArgsSchema: z.ZodType<Prisma.EventUpsertArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
  create: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
  update: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
}).strict() ;

export const EventCreateManyArgsSchema: z.ZodType<Prisma.EventCreateManyArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema,EventCreateManyInputSchema.array() ]),
}).strict() ;

export const EventDeleteArgsSchema: z.ZodType<Prisma.EventDeleteArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateArgsSchema: z.ZodType<Prisma.EventUpdateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateManyArgsSchema: z.ZodType<Prisma.EventUpdateManyArgs> = z.object({
  data: z.union([ EventUpdateManyMutationInputSchema,EventUncheckedUpdateManyInputSchema ]),
  where: EventWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EventDeleteManyArgsSchema: z.ZodType<Prisma.EventDeleteManyArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;