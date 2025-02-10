// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { useValidatedParams, z } from 'h3-zod'
import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: z.string()
  })

  const hubUser = await User.findById(id).populate('organisation').exec()

  if (!hubUser) {
    throw createError({
      status: 404
    })
  }

  return hubUser
})
