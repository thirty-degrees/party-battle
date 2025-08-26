import { getDefaultConfig } from 'expo/metro-config';
import { withNativeWind } from "nativewind/metro";

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css", getCSSForPlatform: async () => "" });
