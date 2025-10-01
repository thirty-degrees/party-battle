import { Button, ButtonText } from '@/components/ui/button'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import Constants from 'expo-constants'
import { Linking, Platform, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context'

export function VersionUpdateScreen() {
  const handleReload = async () => {
    if (Platform.OS === 'web') {
      try {
        const nav = (globalThis as unknown as { navigator?: Navigator }).navigator
        const registrations = await nav?.serviceWorker?.getRegistrations?.()
        registrations?.forEach((r) => r.unregister())
      } catch {}
      try {
        const keys = await caches?.keys?.()
        await Promise.all((keys ?? []).map((k) => caches.delete(k)))
      } catch {}
      window.location.reload()
    }
  }

  const handleUpdate = () => {
    const url =
      Platform.OS === 'ios'
        ? Constants.expoConfig?.extra?.iosMarketUrl
        : Constants.expoConfig?.extra?.androidMarketUrl
    Linking.openURL(url)
  }

  const isWeb = Platform.OS === 'web'

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GluestackUIProvider>
        <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
          <View className="flex-1 p-6 items-center justify-center gap-6">
            <Heading size="4xl" className="text-center">
              New version available
            </Heading>
            <Text size="md">Update to the latest version to continue playing</Text>
            {isWeb ? (
              <Button size="xl" action="primary" onPress={handleReload} style={{ width: 200 }}>
                <ButtonText>Reload</ButtonText>
              </Button>
            ) : (
              <Button size="xl" action="primary" onPress={handleUpdate} style={{ width: 200 }}>
                <ButtonText>Update now</ButtonText>
              </Button>
            )}
          </View>
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  )
}
