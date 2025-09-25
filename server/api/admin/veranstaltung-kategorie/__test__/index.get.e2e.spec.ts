import { beforeAll, describe, expect, test } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import type { PaginationResponseSchema } from '~~/validation/paginationQuerySchema'
import { setupCleanNuxtEnvironment } from '~~/test/utils/mongoMemoryServer'
import { createTestAuthHeader } from '~~/test/utils/jwt'

describe('VeranstaltungsKategorie GET - E2E Test', async () => {
  await setupCleanNuxtEnvironment()

  // Create a test JWT for the tests
  const authHeader = await createTestAuthHeader()

  beforeAll(async () => {
    await $fetch('/api/admin/veranstaltung-kategorie/create', {
      method: 'POST',
      body: {
        name: 'Kategorie A'
      },
      headers: { ...authHeader }
    })

    await $fetch('/api/admin/veranstaltung-kategorie/create', {
      method: 'POST',
      body: {
        name: 'Kategorie B'
      },
      headers: { ...authHeader }
    })
  })

  test('should return paginated veranstaltungsKategorien with metadata', async () => {
    const response = await $fetch<PaginationResponseSchema>('/api/admin/veranstaltung-kategorie', {
      query: {
        limit: '10',
        offset: '0'
      },
      headers: { ...authHeader }
    })

    expect(response).toMatchSnapshot({
      data: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String)
        })
      ]),
      meta: {
        total: expect.any(Number),
        offset: 0,
        limit: 10
      }
    })

    expect(response).toBeDefined()
    expect(response.data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Kategorie A'
      }),
      expect.objectContaining({
        name: 'Kategorie B'
      })
    ]))

    expect(response.meta.total).toBeGreaterThanOrEqual(2)
  })

  test('should return 400 for invalid pagination query params', async () => {
    await expect(() => $fetch('/api/admin/veranstaltung-kategorie', {
      query: {
        limit: 'abc',
        offset: '0'
      },
      headers: { ...authHeader }
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })
})
