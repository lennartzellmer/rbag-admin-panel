import type { Document, Model } from 'mongoose'
import mongoose, { Schema } from 'mongoose'
import type { ICategory } from './Category'
import type { UserDocument } from './User'

/**
 * TypeScript interfaces for each “class” in the diagram.
 */

export interface IParticipantInput {
  name: string
  fieldType: string
}

export interface IWorkshopOffer {
  title: string
  participantInputs: IParticipantInput[]
  referent: UserDocument
}

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

export interface IEvent extends Document {
  name: string
  abbreviation: string
  startDate: Date
  endDate: Date
  published: boolean
  targetGroupDescription: string
  category: ICategory
  location: ILocation
  workshopOffer: IWorkshopOffer[]
  alternativeProgram: IWorkshopOffer[]
  status: EventStatus
  participationFees: IParticipationFees
  performance?: IPerformance // optional
  websiteContent: IWebsiteContent
  registration: IRegistration
}

/**
 * Mongoose sub-schemas for embedded documents.
 */

const ParticipantInputSchema = new Schema<IParticipantInput>({
  name: { type: String, required: true },
  fieldType: { type: String, required: true }
})

const WorkshopOfferSchema = new Schema<IWorkshopOffer>({
  title: { type: String, required: true },
  participantInputs: { type: [ParticipantInputSchema], default: [] },
  referent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

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

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  published: { type: Boolean, required: true },
  targetGroupDescription: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location: { type: LocationSchema, required: true },
  workshopOffer: { type: [WorkshopOfferSchema], required: true },
  alternativeProgram: { type: [WorkshopOfferSchema], required: true },
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
  participationFees: { type: ParticipationFeesSchema, required: true },
  performance: { type: PerformanceSchema, required: false },
  websiteContent: { type: WebsiteContentSchema, required: true },
  registration: { type: RegistrationSchema, required: true }
})

/**
 * Export the Event model.
 */

const EventModel: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema)
export default EventModel
