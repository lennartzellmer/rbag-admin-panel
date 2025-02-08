// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { useValidatedParams, z, useValidatedBody } from 'h3-zod'
import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const { id } = await useValidatedParams(event, {
    id: z.string()
  })

  const userPatchSchema = z.object({
    email: z.string().email().optional(),
    cognitoId: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    organisationId: z.string().optional()
  })

  const body = await useValidatedBody(event, userPatchSchema)

  console.log('body', body)

  const updatedUser = await User.findByIdAndUpdate(
    id,
    body,
    { new: true }
  )

  if (!updatedUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }
  return updatedUser
})
