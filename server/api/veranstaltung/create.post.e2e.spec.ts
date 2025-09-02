import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, it } from 'vitest'
import type { CreateRbagVeranstaltungSchema } from '~~/validation/veranstaltungSchema'

describe('Veranstaltung Creation API - E2E Test', async () => {
  await setup({
    // test context options
  })

  const createValidVeranstaltungData = (): CreateRbagVeranstaltungSchema => ({
    details: {
      name: 'Test Veranstaltung E2E',
      categoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      startDate: new Date('2024-06-01T10:00:00Z'),
      endDate: new Date('2024-06-01T18:00:00Z'),
      zielgruppe: 'Erwachsene'
    },
    isPublished: false,
    isCanceled: false
  })

  it('should successfully create veranstaltung with valid data', async () => {
    const validData = createValidVeranstaltungData()
    const response = await $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: validData
    })

    console.log(response)
  })
})
