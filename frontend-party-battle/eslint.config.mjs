import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import reactCompiler from "eslint-plugin-react-compiler"
import reactPlugin from "eslint-plugin-react"

export default defineConfig([
  expoConfig,
  reactPlugin.configs.flat['jsx-runtime'],
  reactCompiler.configs.recommended,
  {
    ignores: ['dist/**', 'components/ui/**', 'node_modules/**'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      "no-restricted-imports": ["warn", {
        "paths": [{
          "name": "react",
          "importNames": ["useMemo", "useCallback"],
          "message": "React Compiler is enabled here; prefer plain code."
        }]
      }]
    },
  },
]);
