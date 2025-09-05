import { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'frontend-party-battle',
  slug: 'frontend-party-battle',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'partybattle',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true,
    bundleIdentifier: 'ch.thirtydegrees.partybattle',
    associatedDomains: ['applinks:party-battle.thirty-degrees.ch'],
  },
  android: {
    ...(config.android ?? {}),
    package: 'ch.thirty_degrees.party_battle',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: 'https', host: 'party-battle.thirty-degrees.ch' }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-build-properties',
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
    eas: {
      projectId: '8907377f-75e3-4efd-9a3a-4556dfda4c47',
    },
    backendUrl:
      process.env.EXPO_PUBLIC_BACKEND_URL ||
      `https://party-battle.thirty-degrees.ch/api/v${config.version}`,
    frontendUrl:
      process.env.EXPO_PUBLIC_FRONTEND_URL ||
      `https://party-battle.thirty-degrees.ch`,
    router: {},
  },
  owner: 'thirty-degrees',
})
