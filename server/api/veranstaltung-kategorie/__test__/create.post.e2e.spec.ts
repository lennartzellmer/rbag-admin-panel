import { describe, expect, test } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import type { MultiStreamAppendResult } from 'vorfall'
import type { ErstelleVeranstaltungKategorieSchema } from '~~/server/domain/veranstaltungsKategorie/validation'
import type { VeranstaltungsKategorieErstellt } from '~~/server/domain/veranstaltungsKategorie/eventHandling'

describe('VeranstaltungsKategorie Creation API - E2E Test', async () => {
  await setup({

  })

  const validData: ErstelleVeranstaltungKategorieSchema = {
    name: 'Test Kategorie E2E'
  }

  test('should successfully create veranstaltungsKategorie with valid data', async () => {
    const response = await $fetch<MultiStreamAppendResult<VeranstaltungsKategorieErstellt>>('/api/veranstaltung-kategorie/create', {
      method: 'POST',
      body: validData
    })

    expect(response).toMatchSnapshot({
      streamSubjects: [
        expect.stringMatching(/^VeranstaltungKategorie\/[0-9a-f-]{36}$/)
      ],
      streams: [
        {
          _id: expect.any(String),
          streamId: expect.any(String),
          streamSubject: expect.stringMatching(/^VeranstaltungKategorie\/[0-9a-f-]{36}$/),
          metadata: {
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          },
          events: [
            {
              id: expect.any(String),
              date: expect.any(String),
              time: expect.any(String),
              subject: expect.stringMatching(/^VeranstaltungKategorie\/[0-9a-f-]{36}$/)
            }
          ]
        }
      ],
      totalEventsAppended: expect.any(Number)
    })
  })

  test('should return 400 for empty name', async () => {
    const invalidData = { ...validData }
    invalidData.name = ''

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
    const invalidData = { ...validData }
    invalidData.name = 'a'

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })

  test('should return 400 for missing required fields', async () => {
    const invalidData = { ...validData }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (invalidData.name as any).name

    await expect(() => $fetch('/api/veranstaltung/create', {
      method: 'POST',
      body: invalidData
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })
})
