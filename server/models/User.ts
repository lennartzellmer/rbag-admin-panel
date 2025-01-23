import { defineMongooseModel } from '#nuxt/mongoose'

export const User = defineMongooseModel({
  name: 'User',
  schema: {
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
      required: false
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
    collection: 'users'
  }
})
