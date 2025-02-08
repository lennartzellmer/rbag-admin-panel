import mongoose, { Schema } from 'mongoose'

export interface ICategory {
  id: string
  name: string
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true },
  name: { type: String, required: true }
})

const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema)

export default CategoryModel
