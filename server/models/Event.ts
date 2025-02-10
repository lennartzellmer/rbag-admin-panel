import type { Document, InferSchemaType, Model, Types } from 'mongoose'
import { Schema, model } from 'mongoose'

/**
 * TypeScript interfaces for each “class” in the diagram.
 */

export interface IParticipationFees {
  childrenAndYouth: number
  youngAdults: number
  youngAdultsMultiplier: number
  adults: number
  adultsMultiplier: number
}

export interface ILocation {
  // Although the diagram shows “Location_line1” etc.,
  // we convert to camelCase for TypeScript.
  name: string
  line1: string
  line2?: string
  postalCode: string
  countryCode: string
}

export interface IWebsiteContent {
  image: string
  description: string
}

export interface IRegistration {
  fromPDFDownloadLink: string
  startDate: Date
  endDate: Date
  confirmationText: string
  checkinOpen: boolean
  externalLink: string
  lateRegistration: boolean
  singleRoomSurcharge: number
  participationFees: IParticipationFees
}

export interface IPerformance {
  startDate: Date
  endDate: Date
  description: string
  location: ILocation
  posterDownloadUrl: string
  showOnEventPage: boolean
}

export type EventStatus =
  | 'SAVE_THE_DATE'
  | 'REGISTRATION_SCHEDULED'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'COMPLETED'
  | 'CANCELED'

export interface IEvent {
  name: string
  abbreviation: string
  startDate: Date
  endDate: Date
  published: boolean
  targetGroupDescription: string
  category: Types.ObjectId
  location?: ILocation
  workshopOffer: Types.ObjectId[]
  alternativeProgram: Types.ObjectId[]
  status: EventStatus
  performance?: IPerformance
  websiteContent?: IWebsiteContent
  registration?: IRegistration
}

export interface IEventDocument extends Document, IEvent {}

/**
 * Mongoose sub-schemas for embedded documents.
 */

const ParticipationFeesSchema = new Schema<IParticipationFees>({
  childrenAndYouth: { type: Number, required: true },
  youngAdults: { type: Number, required: true },
  youngAdultsMultiplier: { type: Number, required: true },
  adults: { type: Number, required: true },
  adultsMultiplier: { type: Number, required: true }
})

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  postalCode: { type: String, required: true },
  countryCode: { type: String, required: true }
})

const WebsiteContentSchema = new Schema<IWebsiteContent>({
  image: { type: String, required: true },
  description: { type: String, required: true }
})

const RegistrationSchema = new Schema<IRegistration>({
  fromPDFDownloadLink: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  confirmationText: { type: String, required: true },
  checkinOpen: { type: Boolean, required: true },
  externalLink: { type: String, required: true },
  lateRegistration: { type: Boolean, required: true },
  singleRoomSurcharge: { type: Number, required: true },
  participationFees: { type: ParticipationFeesSchema, required: true }
})

const PerformanceSchema = new Schema<IPerformance>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  posterDownloadUrl: { type: String, required: true },
  showOnEventPage: { type: Boolean, required: true }
})

/**
 * The main Event schema.
 */

const EventSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  published: { type: Boolean, required: true },
  targetGroupDescription: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location: { type: LocationSchema },
  workshopOffer: [{
    type: Schema.Types.ObjectId,
    ref: 'WorkshopOffer',
    required: true
  }],
  alternativeProgram: [{
    type: Schema.Types.ObjectId,
    ref: 'WorkshopOffer',
    required: true
  }],
  status: {
    type: String,
    enum: [
      'SAVE_THE_DATE',
      'REGISTRATION_SCHEDULED',
      'REGISTRATION_OPEN',
      'REGISTRATION_CLOSED',
      'COMPLETED',
      'CANCELED'
    ],
    required: true
  },
  performance: { type: PerformanceSchema },
  websiteContent: { type: WebsiteContentSchema },
  registration: { type: RegistrationSchema }
}, {
  versionKey: false,
  collection: 'events',
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

/**
 * Export the Event model.
 */

export const EventModel = model<IEventDocument>('Event', EventSchema)
