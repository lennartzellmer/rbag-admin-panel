import type { Document } from 'mongoose'
import mongoose from 'mongoose'

export interface OrganisationDocument extends Document {
  _id: string
  name?: string
  phone?: string
  createdAt: Date
  lastModifiedAt: Date
  status?: 'PENDING' | 'CONFIRMED'
  evseIds?: string[]
  _class?: string
  trailPeriodExpiresAt?: Date
}

const organisationSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  createdAt: {
    type: Date
  },
  status: {
    enum: ['PENDING', 'CONFIRMED']
  },
  evseIds: {
    strings: [String]
  },
  lastModifiedAt: {
    type: Date
  },
  _class: {
    type: String
  },
  trailPeriodExpiresAt: {
    type: Date,
    required: false
  }
}, {
  // We have our own createdAt/lastModifiedAt fields, so no need for Mongoose timestamps
  timestamps: false,
  versionKey: false,
  collection: 'organisations',
  _id: false,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

export const Organisation = mongoose.model<OrganisationDocument>('Organisation', organisationSchema)
