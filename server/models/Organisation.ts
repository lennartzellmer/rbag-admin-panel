import { defineMongooseModel } from '#nuxt/mongoose'

export interface IOrganisation {
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

export const Organisation = defineMongooseModel({
  name: 'Organisation',
  schema: {
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
  },
  options: {
    // We have our own createdAt/lastModifiedAt fields, so no need for Mongoose timestamps
    timestamps: false,
    versionKey: false,
    collection: 'organisations',
    _id: false
  }
})
