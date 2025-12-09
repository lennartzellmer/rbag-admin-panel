import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { getVeranstaltungKategorieById } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { useValidatedParams } from '~~/server/utils/useValidated'

export default defineEventHandler(async (event) => {
  // =============================================================================
  // Parse and validate
  // =============================================================================

  const validatedParams = await useValidatedParams(event, z.object({
    id: z.string().uuid()
  }))

  // =============================================================================
  // Get category by id
  // =============================================================================

  const eventStore = event.context.eventStore

  const rbagEventCategory = await getVeranstaltungKategorieById(eventStore, validatedParams.id)

  if (!rbagEventCategory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found'
    })
  }

  return rbagEventCategory
})
