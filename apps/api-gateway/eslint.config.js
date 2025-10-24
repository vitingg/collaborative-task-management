import baseConfig from '@collab-task-management/eslint-config/nest'
import path from 'path'

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: path.resolve(process.cwd(), 'tsconfig.json'),
        tsconfigRootDir: path.resolve(process.cwd()),
      },
    },
  },
]
