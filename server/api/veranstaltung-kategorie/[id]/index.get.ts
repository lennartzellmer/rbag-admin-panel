import { defineEventHandler } from 'h3'
import { useSafeValidatedParams, z } from 'h3-zod'
import { getRbagVeranstaltungKategorieById } from '~~/server/eventDriven/rbagVeranstaltungsKategorie'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate request body
  // =============================================================================

  const {
    success: isValidParams,
    data: validatedParams,
    error: validationError
  } = await useSafeValidatedParams(event, {
    id: z.string().uuid()
  })

  if (!isValidParams) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event data',
      statusText: validationError?.message
    })
  }

  // =============================================================================
  // Get category by id
  // =============================================================================

  const eventStore = event.context.eventStore

  const rbagEventCategory = await getRbagVeranstaltungKategorieById(eventStore, validatedParams.id)

  if (!rbagEventCategory) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  return rbagEventCategory
})
