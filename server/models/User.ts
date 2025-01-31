import type { Document } from 'mongoose'
import type { IOrganisation } from './Organisation'
import { defineMongooseModel } from '#nuxt/mongoose'

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
  organisation?: IOrganisation
}

export const User = defineMongooseModel<UserDocument>({
  name: 'User',
  schema: {
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
  },
  options: {
    // We have our own createdAt/lastModifiedAt fields, so no need for Mongoose timestamps
    timestamps: false,
    versionKey: false,
    collection: 'users',
    _id: false,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  },
  hooks(schema) {
    // Define the virtual on the schema
    schema.virtual('organisation', {
      ref: 'Organisation', // Which model to link to
      localField: 'organisationId', // Field in this schema
      foreignField: '_id', // Field in the Organisation schema
      justOne: true // Whether it's a single doc or an array
    })
  }
})
