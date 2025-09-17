import { beforeAll, describe, expect, test } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import type { PaginationResponseSchema } from '~~/validation/paginationQuerySchema'
import { setupMongoMemoryServer } from '~~/test/utils/mongoMemoryServer'

describe('VeranstaltungsKategorie GET - E2E Test', async () => {
  const connectionString = await setupMongoMemoryServer()
  await setup({
    env: {
      NUXT_MONGODB_EVENT_STORE_URI: connectionString
    }
  })

  beforeAll(async () => {
    await $fetch('/api/veranstaltung-kategorie/create', {
      method: 'POST',
      body: {
        name: 'Kategorie A'
      }
    })

    await $fetch('/api/veranstaltung-kategorie/create', {
      method: 'POST',
      body: {
        name: 'Kategorie B'
      }
    })
  })

  test('should return paginated veranstaltungsKategorien with metadata', async () => {
    const response = await $fetch<PaginationResponseSchema>('/api/veranstaltung-kategorie', {
      query: {
        limit: '10',
        offset: '0'
      }
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
    await expect(() => $fetch('/api/veranstaltung-kategorie', {
      query: {
        limit: 'abc',
        offset: '0'
      }
    })).rejects.toThrowError(expect.objectContaining({
      statusCode: 400
    }))
  })
})
