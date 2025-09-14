import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import { PlayerNameProvider } from '@/src/index/PlayerNameProvider'
import { LobbyRoomProvider } from '@/src/lobby/LobbyRoomProvider'
import { VersionUpdateScreen } from '@/src/VersionUpdateScreen'
import { useFonts } from 'expo-font'
import { ErrorBoundary as DefaultErrorBoundary, ErrorBoundaryProps, Stack } from 'expo-router'
import Head from 'expo-router/head'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <React.StrictMode>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GluestackUIProvider>
          <PlayerNameProvider>
            <LobbyRoomProvider>
              <Head>
                <title>Party Battle</title>
              </Head>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="lobby" />
                <Stack.Screen name="games/pick-cards" />
                <Stack.Screen name="games/snake" />
                <Stack.Screen name="games/potato" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </LobbyRoomProvider>
          </PlayerNameProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </React.StrictMode>
  )
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  if (
    error.cause &&
    typeof error.cause === 'object' &&
    'code' in error.cause &&
    (error.cause.code === 'API_VERSION_UNSUPPORTED' ||
      (error.cause.code === 404 &&
        'message' in error.cause &&
        error.cause.message === 'API_VERSION_UNSUPPORTED'))
  ) {
    return <VersionUpdateScreen />
  }

  return <DefaultErrorBoundary retry={retry} error={error} />
}
