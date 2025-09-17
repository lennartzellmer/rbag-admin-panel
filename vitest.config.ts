import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    silent: false,
    projects: [
      await defineVitestProject({
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.e2e.spec.ts'],
          environment: 'nuxt'
        }
      }),
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt'
        }
      })
    ]
  }
})
