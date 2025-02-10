import type { Document, Model } from 'mongoose'
import mongoose, { Schema } from 'mongoose'
import type { UserDocument } from './User'

export interface IParticipantInput {
  name: string
  fieldType: string
}

export interface IWorkshopOffer extends Document {
  title: string
  participantInputs: IParticipantInput[]
  referent: UserDocument
}

const ParticipantInputSchema = new Schema<IParticipantInput>({
  name: { type: String, required: true },
  fieldType: { type: String, required: true }
})

const WorkshopOfferSchema = new Schema<IWorkshopOffer>({
  title: { type: String, required: true },
  participantInputs: { type: [ParticipantInputSchema], default: [] },
  referent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export const WorkshopOfferModel: Model<IWorkshopOffer> = mongoose.model<IWorkshopOffer>('WorkshopOffer', WorkshopOfferSchema)
