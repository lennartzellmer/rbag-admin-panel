import { z } from 'zod'

// Base version metadata schema
export const versionMetadataSchema = z.object({
  createdBy: z.string().refine((val) => {
    return val.match(/^[0-9a-fA-F]{24}$/)
  }),
  createdAt: z.coerce.date(),
  changeType: z.string()
})

// Generic versioned document schema factory
export function createVersionedSchema<T extends z.ZodType>(documentSchema: T) {
  return z.object({
    version: z.number(),
    metadata: versionMetadataSchema,
    document: documentSchema
  })
}
