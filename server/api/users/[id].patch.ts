// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { useValidatedParams, z, useValidatedBody } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'Access denied',
      message: 'Please log in'
    })
  }

  const { id } = await useValidatedParams(event, {
    id: z.string()
  })

  const userPatchSchema = z.object({
    email: z.string().email().optional(),
    cognitoId: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    createdAt: z.preprocess(val => val && new Date(val as string), z.date().optional()),
    lastModifiedAt: z.preprocess(val => val && new Date(val as string), z.date().optional()),
    _class: z.string().optional(),
    organisationId: z.string().optional()
  })

  const body = await useValidatedBody(event, userPatchSchema)

  // 4. Perform the partial update in MongoDB
  const updatedUser = await User.findByIdAndUpdate(
    id,
    body,
    { new: true } // returns the updated document
  )

  if (!updatedUser) {
    // If no user is found for the given ID, throw a 404
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  // 5. Return the updated user
  return updatedUser
})
