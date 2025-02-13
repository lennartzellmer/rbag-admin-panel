import { z } from 'zod'
import { defineEventHandler, createError } from 'h3'
import { useValidatedParams, useValidatedBody } from 'h3-zod'
import mongoose from 'mongoose'
import { EventModel } from '../../models/Event'

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
  countryCode: z.string().length(3)
})

const websiteContentSchema = z.object({
  image: z.string().min(1),
  description: z.string().min(1)
}).optional()

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

const eventPatchSchema = z.object({
  name: z.string().min(1).optional(),
  abbreviation: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  published: z.boolean().optional(),
  targetGroupDescription: z.string().min(1).optional(),
  category: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  }).optional(),
  location: locationSchema.optional(),
  workshopOffer: z.array(z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  })).optional(),
  alternativeProgram: z.array(z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  })).optional(),
  status: z.enum([
    'SAVE_THE_DATE',
    'REGISTRATION_SCHEDULED',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'COMPLETED',
    'CANCELED'
  ]).optional(),
  performance: performanceSchema.optional(),
  websiteContent: websiteContentSchema.optional(),
  registration: registrationSchema.optional()
})

export default defineEventHandler(async (event) => {
  // const { user } = await requireUserSession(event)

  // if (!user) {
  //   throw createError({
  //     status: 401,
  //     statusMessage: 'Access denied',
  //     message: 'Please log in'
  //   })
  // }

  try {
    const { id } = await useValidatedParams(event, {
      id: z.string().refine(val => mongoose.Types.ObjectId.isValid(val))
    })

    const body = await useValidatedBody(event, eventPatchSchema)

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      body,
      { new: true }
    )

    if (!updatedEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    return updatedEvent
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid event data'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Error updating event'
    })
  }
})
