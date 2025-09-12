import { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = process.env.EXPO_PUBLIC_ENV || 'dev'
  if (!['prod', 'dev'].includes(env)) throw new Error(`Invalid EXPO_PUBLIC_ENV: ${env}`)

  const envMap = {
    prod: {
      backendUrl: `https://party-battle.thirty-degrees.ch/api/v${config.version}`,
      frontendUrl: `https://party-battle.thirty-degrees.ch`,
      owner: 'thirty-degrees',
      easProjectId: '8907377f-75e3-4efd-9a3a-4556dfda4c47',
    },
    dev: {
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || `http://localhost:2567`,
      frontendUrl: process.env.EXPO_PUBLIC_FRONTEND_URL || `http://localhost:8081`,
      owner: process.env.EXPO_PUBLIC_OWNER,
      easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  } as const

  const { backendUrl, frontendUrl, owner, easProjectId } = envMap[env as keyof typeof envMap]

  const androidPackage = 'ch.thirty_degrees.party_battle'
  const appleAppId = '6751968403'

  return {
    ...config,
    name: 'Party Battle',
    slug: 'frontend-party-battle',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'partybattle',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      ...(config.ios ?? {}),
      supportsTablet: true,
      bundleIdentifier: 'ch.thirty-degrees.party-battle',
      associatedDomains: ['applinks:party-battle.thirty-degrees.ch'],
    },
    android: {
      ...(config.android ?? {}),
      package: androidPackage,
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
      ...(easProjectId && {
        eas: {
          projectId: easProjectId,
        },
      }),
      backendUrl: backendUrl,
      frontendUrl: frontendUrl,
      androidMarketUrl: `market://details?id=${androidPackage}`,
      androidMarketWebUrl: `https://play.google.com/store/apps/details?id=${androidPackage}`,
      iosMarketUrl: `itms-apps://itunes.apple.com/app/id${appleAppId}`,
      iosMarketWebUrl: `https://apps.apple.com/us/app/party-battle/id${appleAppId}`,
      router: {},
    },
    ...(owner && { owner }),
  }
}
