// @ts-check
import unusedImports from 'eslint-plugin-unused-imports'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  name: 'project/unused-imports',
  plugins: {
    'unused-imports': unusedImports
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-multiple-template-root': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ]
  }
})
