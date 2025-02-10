import { z } from 'zod'
import { defineEventHandler, readBody, createError } from 'h3'
import mongoose from 'mongoose'
import type { IEvent } from '../../models/Event'
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
  countryCode: z.string().min(1)
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

const eventSchema = z.object({
  name: z.string().min(1),
  abbreviation: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  published: z.boolean(),
  targetGroupDescription: z.string().min(1),
  category: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  }), // MongoDB ObjectId as string
  location: locationSchema,
  workshopOffer: z.array(z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  })), // MongoDB ObjectId as string
  alternativeProgram: z.array(z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val)
  })), // MongoDB ObjectId as string
  status: z.enum([
    'SAVE_THE_DATE',
    'REGISTRATION_SCHEDULED',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'COMPLETED',
    'CANCELED'
  ]),
  performance: performanceSchema,
  websiteContent: websiteContentSchema,
  registration: registrationSchema
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'Access denied',
      message: 'Please log in'
    })
  }

  try {
    const body = await readBody(event)
    const validatedData = eventSchema.parse(body)

    const newEvent = await EventModel.create({
      ...validatedData
    })

    return {
      data: newEvent
    }
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
      message: 'Error creating event'
    })
  }
})
