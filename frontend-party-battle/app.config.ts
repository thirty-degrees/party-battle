import { config as dotenvConfig } from "dotenv";
import { ConfigContext, ExpoConfig } from "expo/config";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, ".env.development") });

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "frontend-party-battle",
  slug: "frontend-party-battle",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "frontendpartybattle",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true,
  },
  android: {
    ...(config.android ?? {}),
    package: "ch.thirty_degrees.party_battle",
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
  },
});
