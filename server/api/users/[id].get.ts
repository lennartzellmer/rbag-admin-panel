// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { useValidatedParams, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: z.string()
  })

  // Perform a paginated query
  const hubUser = await User.findById(id)

  if (!hubUser) {
    createError({
      status: 404
    })
  }

  return hubUser
})
