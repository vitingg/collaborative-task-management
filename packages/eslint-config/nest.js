import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * @type {import("eslint").Linter.Config[]}
 * */
export default [

  {
    ignores: ['eslint.config.js', 'dist'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
]