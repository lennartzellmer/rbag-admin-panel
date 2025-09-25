import { describe, expect, test } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import type { MultiStreamAppendResult } from 'vorfall'
import type { ErstelleVeranstaltungKategorieSchema } from '~~/server/domain/veranstaltungsKategorie/validation'
import type { VeranstaltungsKategorieErstellt } from '~~/server/domain/veranstaltungsKategorie/eventHandling'
import { setupCleanNuxtEnvironment } from '~~/test/utils/mongoMemoryServer'
import { createTestJwt } from '~~/test/utils/jwt'

describe('VeranstaltungsKategorie Creation API - E2E Test', async () => {
  await setupCleanNuxtEnvironment()

  const validData: ErstelleVeranstaltungKategorieSchema = {
    name: 'Test Kategorie E2E'
  }

  // Create a test JWT for the tests
  const jwt = await createTestJwt()

  test('should successfully create veranstaltungsKategorie with valid data', async () => {
    const result = await $fetch<MultiStreamAppendResult<VeranstaltungsKategorieErstellt>>('/api/admin/veranstaltung-kategorie/create', {
      method: 'POST',
      body: validData,
      headers: {
        authorization: `Bearer ${jwt}`
      }
    })

    expect(result).toMatchSnapshot({
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

  // test('should return 400 for empty name', async () => {
  //   const invalidData = { ...validData }
  //   invalidData.name = ''

  //   await expect(() => $fetch('/api/admin/veranstaltung/create', {
  //     method: 'POST',
  //     body: invalidData,
  //     headers: {
  //       authorization: `Bearer ${jwt}`
  //     }
  //   })).rejects.toThrowError(expect.objectContaining({
  //     statusCode: 400,
  //     data: expect.objectContaining({
  //       statusMessage: 'Invalid event data'
  //     })
  //   }))
  // })

  // test('should return 400 for name shorter than 3 characters', async () => {
  //   const invalidData = { ...validData }
  //   invalidData.name = 'a'

  //   await expect(() => $fetch('/api/admin/veranstaltung/create', {
  //     method: 'POST',
  //     body: invalidData,
  //     headers: {
  //       authorization: `Bearer ${jwt}`
  //     }
  //   })).rejects.toThrowError(expect.objectContaining({
  //     statusCode: 400
  //   }))
  // })

  // test('should return 400 for missing required fields', async () => {
  //   const invalidData = { ...validData }
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   delete (invalidData.name as any).name

  //   await expect(() => $fetch('/api/admin/veranstaltung/create', {
  //     method: 'POST',
  //     body: invalidData,
  //     headers: {
  //       authorization: `Bearer ${jwt}`
  //     }
  //   })).rejects.toThrowError(expect.objectContaining({
  //     statusCode: 400
  //   }))
  // })
})
