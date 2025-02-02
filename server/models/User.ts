import type { Document } from 'mongoose'
import mongoose from 'mongoose'
import type { OrganisationDocument } from './Organisation'
import { Organisation } from './Organisation'

export interface UserInput {
  firstname: string
  lastname: string
}

export interface UserDocument extends UserInput, Document {
  _id: string
  email: string
  cognitoId: string
  createdAt: Date
  lastModifiedAt: Date
  _class?: string
  organisationId?: string
  organisation?: OrganisationDocument
}

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cognitoId: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  lastModifiedAt: {
    type: Date,
    required: true
  },
  _class: {
    type: String
  },
  organisationId: {
    type: String,
    ref: 'Organisation',
    required: false
  }
}, {
  timestamps: false,
  versionKey: false,
  collection: 'users',
  id: false,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

userSchema.virtual('organisation', {
  ref: Organisation.modelName, // Which model to link to
  localField: 'organisationId', // Field in this schema
  foreignField: '_id', // Field in the Organisation schema
  justOne: true // Whether it's a single doc or an array
})

export const User = mongoose.model<UserDocument>('User', userSchema)
