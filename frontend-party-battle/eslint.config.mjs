import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import reactCompiler from "eslint-plugin-react-compiler"
import reactPlugin from "eslint-plugin-react"
import babelParser from "@babel/eslint-parser"

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  expoConfig,
  reactPlugin.configs.flat['jsx-runtime'],
  reactCompiler.configs.recommended,
  {
    ignores: ['dist/**', 'components/ui/**', 'node_modules/**'],
    languageOptions: {
      parser: babelParser,
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
