import { config as dotenvConfig } from "dotenv";
import { ConfigContext, ExpoConfig } from "expo/config";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, ".env.development") });

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "frontend-party-battle",
  slug: "frontend-party-battle",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "frontendpartybattle",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    buildNumber: "1",
    supportsTablet: true,
  },
  android: {
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    backendUrl:
      process.env.EXPO_PUBLIC_BACKEND_URL ||
      `https://party-battle.thirty-degrees.ch/api/v${config.version}`,
  },
});
