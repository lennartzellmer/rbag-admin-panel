import type { Document } from 'mongoose'
import { Schema, model } from 'mongoose'

export interface ICategory {
  description: string
  name: string
}

export interface ICategoryDocument extends Document, ICategory {}

const CategorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
})

export const CategoryModel = model<ICategory>('Category', CategorySchema)
