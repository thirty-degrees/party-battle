import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import { PlayerNameProvider } from '@/src/index/PlayerNameProvider'
import { LobbyRoomProvider } from '@/src/lobby/LobbyRoomProvider'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import Head from 'expo-router/head'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <React.StrictMode>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <PlayerNameProvider>
            <LobbyRoomProvider>
              <Head>
                <title>Party Battle</title>
              </Head>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="lobby" />
                <Stack.Screen name="games/croc" />
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
