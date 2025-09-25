import expoConfig from 'eslint-config-expo/flat.js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['.expo', 'dist/*', 'node_modules/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': [
        'error',
        {
          allow: [
            '\\.(aac|aiff|avif|bmp|caf|db|gif|heic|html|jpeg|jpg|json|m4a|m4v|mov|mp3|mp4|mpeg|mpg|otf|pdf|png|psd|riv|svg|ttf|wav|webm|webp|xml|yaml|yml|zip)$',
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text'],
              message: 'Please use Text from @/components/ui/text instead of react-native.',
            },
          ],
        },
      ],
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['components/ui/**/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])
