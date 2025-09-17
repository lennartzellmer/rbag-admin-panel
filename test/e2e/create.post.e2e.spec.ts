import { describe, expect, test } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import type { WithId } from 'mongodb'

import type { EventStream } from 'vorfall'
import type { CreateVeranstaltungSchema } from '~~/validation/veranstaltungSchema'
import type { VeranstaltungErstellt } from '~~/server/eventDriven/veranstaltung'

describe('Veranstaltung Creation API - E2E Test', async () => {
  await setup({})

  const createValidVeranstaltungData = (): CreateVeranstaltungSchema => {
    return {
      details: {
        name: 'Test Veranstaltung E2E',
        categoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        startDate: new Date('2025-06-01T10:00:00Z'),
        endDate: new Date('2025-06-01T18:00:00Z'),
        zielgruppe: 'Erwachsene'
      },
      isPublished: false,
      isCanceled: false
    }
  }

  test('should successfully create veranstaltung with valid data', async () => {
    const validData = createValidVeranstaltungData()

    const response = await $fetch<WithId<EventStream<VeranstaltungErstellt>>>('/api/veranstaltung/create', {
      method: 'POST',
      body: validData
    })

    expect(response).toMatchSnapshot({
      _id: expect.any(String),
      streamId: expect.any(String),
      streamSubject: expect.stringMatching(/^Veranstaltung\/[0-9a-f-]{36}$/),
      metadata: {
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      },
      events: [{
        id: expect.any(String),
        date: expect.any(String),
        time: expect.any(String),
        subject: expect.stringMatching(/^Veranstaltung\/[0-9a-f-]{36}$/)
      }]
    })
  })

  test('should return 400 for empty name', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.name = ''

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400,
      data: expect.objectContaining({
        message: 'Invalid event data'
      })
    }))
  })

  test('should return 400 for name shorter than 3 characters', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.name = 'ab'

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })

  test('should return 400 for invalid UUID categoryId', async () => {
    const invalidData = createValidVeranstaltungData()
    invalidData.details.categoryId = 'invalid-uuid'

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })

  test('should return 400 for invalid date format', async () => {
    const invalidData = createValidVeranstaltungData()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invalidData.details.startDate = 'invalid-date' as any

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })

  test('should return 400 for missing required fields', async () => {
    const invalidData = createValidVeranstaltungData()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (invalidData.details as any).zielgruppe

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })
})
