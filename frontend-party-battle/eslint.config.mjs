import expoConfig from "eslint-config-expo/flat.js";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

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
    ignores: [".expo", "dist/*", "node_modules/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      'prettier/prettier': 'warn',
    },
  }
]);
