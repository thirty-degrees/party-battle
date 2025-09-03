import { config as dotenvConfig } from "dotenv";
import { ConfigContext, ExpoConfig } from "expo/config";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, ".env.development"), quiet: true });

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "frontend-party-battle",
  slug: "frontend-party-battle",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "partybattle",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true,
    associatedDomains: ["applinks:party-battle.thirty-degrees.ch"],
  },
  android: {
    ...(config.android ?? {}),
    package: "ch.thirty_degrees.party_battle",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    "intentFilters": [
      {
        action: "VIEW",
        data: [{ scheme: "https", host: "party-battle.thirty-degrees.ch" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
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
    [
      "expo-build-properties",
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    backendUrl:
      process.env.EXPO_PUBLIC_BACKEND_URL ||
      `https://party-battle.thirty-degrees.ch/api/v${config.version}`,
    frontendUrl:
      process.env.EXPO_PUBLIC_FRONTEND_URL ||
      `https://party-battle.thirty-degrees.ch`,
  },
});
