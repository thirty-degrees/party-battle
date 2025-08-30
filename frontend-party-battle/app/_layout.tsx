import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { LobbyProvider } from "@/lobby/LobbyProvider";
import { PlayerNameProvider } from "@/index/PlayerNameProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CrocGameProvider } from "@/games/CrocGameProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
              <CrocGameProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="lobby" />
                  <Stack.Screen name="games/croc-game" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </CrocGameProvider>
            </LobbyProvider>
          </PlayerNameProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </React.StrictMode>
  );
}
