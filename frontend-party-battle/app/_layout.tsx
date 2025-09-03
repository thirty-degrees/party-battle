import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { PlayerNameProvider } from '@/index/PlayerNameProvider';
import { LobbyProvider } from '@/lobby/LobbyProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <React.StrictMode>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <PlayerNameProvider>
            <LobbyProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="lobby" />
                <Stack.Screen name="games/croc-game" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </LobbyProvider>
          </PlayerNameProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </React.StrictMode>
  );
}
