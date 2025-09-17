import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    silent: false,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['server/**/*.{test,spec}.ts'],
          exclude: ['**/*.e2e.spec.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'e2e',
          include: ['server/**/*.e2e.spec.ts'],
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
