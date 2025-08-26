import { getDefaultConfig } from 'expo/metro-config.js';
import { withNativeWind } from 'nativewind/metro';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = getDefaultConfig(__dirname);

export default withNativeWind(config, { 
  input: "./global.css",
  getCSSForPlatform: async () => ""
});
