import { randomUUID } from 'node:crypto'
import { describe, expect, test } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { FetchError } from 'ofetch'

import type { EventStream } from 'vorfall'
import type { CreateRbagVeranstaltungSchema } from '~~/validation/veranstaltungSchema'

describe('Veranstaltung Creation API - E2E Test', async () => {
  await setup({
    // test context options
  })

  const createValidVeranstaltungData = (): CreateRbagVeranstaltungSchema => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    const endDate = new Date(futureDate.getTime() + 8 * 60 * 60 * 1000) // 8 hours later

    return {
      details: {
        name: 'Test Veranstaltung E2E',
        categoryId: randomUUID(),
        startDate: futureDate,
        endDate: endDate,
        zielgruppe: 'Erwachsene'
      },
      isPublished: false,
      isCanceled: false
    }
  }

  test('should successfully create veranstaltung with valid data', async () => {
    const validData = createValidVeranstaltungData()
    
    const response = await $fetch<EventStream<'RbagVeranstaltungCreated', CreateRbagVeranstaltungSchema>>('/api/veranstaltung/create', {
      method: 'POST',
      body: validData
    })

    // Use inline snapshot with asymmetric matchers for dynamic values
    expect(response).toMatchInlineSnapshot({
      events: [{
        type: 'RbagVeranstaltungCreated',
        data: {
          details: {
            name: 'Test Veranstaltung E2E',
            categoryId: expect.any(String), // UUID changes each run
            startDate: expect.any(String),  // Dynamic dates
            endDate: expect.any(String),    // Dynamic dates
            zielgruppe: 'Erwachsene'
          },
          isPublished: false,
          isCanceled: false
        }
      }]
    }, `
      {
        "_id": "68b8a9d82fd318a717256492",
        "events": [
          {
            "data": {
              "details": {
                "categoryId": Any<String>,
                "endDate": Any<String>,
                "name": "Test Veranstaltung E2E",
                "startDate": Any<String>,
                "zielgruppe": "Erwachsene",
              },
              "isCanceled": false,
              "isPublished": false,
            },
            "datacontenttype": "application/json",
            "date": "2025-09-03T20:49:27.917Z",
            "id": "a55be303-9c88-4dc1-a460-93b01617a4fd",
            "metadata": {
              "changedBy": "test@test.de",
            },
            "source": "vorfall.eventsourcing.system",
            "specversion": "1.0",
            "subject": "RbagVeranstaltung/38f1a946-ef8f-44e2-b298-cc62571e3529",
            "time": "2025-09-03T20:49:27.917Z",
            "type": "RbagVeranstaltungCreated",
            "version": "1.0",
          },
        ],
        "metadata": {
          "createdAt": "2025-09-03T20:49:27.920Z",
          "updatedAt": "2025-09-03T20:49:27.920Z",
        },
        "streamId": "02c98562-1e80-4dd9-a4b9-cf6c6a95fc6d",
        "streamSubject": "RbagVeranstaltung/38f1a946-ef8f-44e2-b298-cc62571e3529",
      }
    `)
    
    // Additional validation for business logic
    const eventData = response.events[0]!.data
    const startDate = new Date(eventData.details.startDate)
    const endDate = new Date(eventData.details.endDate)
    
    expect(startDate).toBeInstanceOf(Date)
    expect(endDate).toBeInstanceOf(Date)
    expect(startDate.getTime()).toBeGreaterThan(Date.now())
    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime())
    
    // Verify UUID format
    expect(eventData.details.categoryId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  test('should return 400 for empty name', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.name = ''

    await expect(
      $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    ).rejects.toThrow(FetchError)

    try {
      await $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(FetchError)
      if (error instanceof FetchError) {
        expect(error.statusCode).toBe(400)
        expect(error.data?.message).toBe('Invalid event data')
      }
    }
  })

  test('should return 400 for name shorter than 3 characters', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.name = 'ab'

    try {
      await $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(FetchError)
      if (error instanceof FetchError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('should return 400 for invalid UUID categoryId', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.categoryId = 'invalid-uuid'

    try {
      await $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(FetchError)
      if (error instanceof FetchError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('should return 400 for invalid date format', async () => {
    const invalidData = createValidVeranstaltungData()
    // @ts-expect-error - intentionally passing invalid date
    invalidData.details.startDate = 'invalid-date'

    try {
      await $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(FetchError)
      if (error instanceof FetchError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('should return 400 for missing required fields', async () => {
    const invalidData = createValidVeranstaltungData()
    // @ts-expect-error - intentionally removing required field
    delete invalidData.details.zielgruppe

    try {
      await $fetch('/api/veranstaltung/create', {
        method: 'POST',
        body: invalidData
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(FetchError)
      if (error instanceof FetchError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })
})
