import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from 'eslint/config';

export default defineConfig([
  expoConfig,
  {
    ignores: [".expo", "dist/*", "node_modules/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
]);
