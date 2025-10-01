import { Button, ButtonText } from '@/components/ui/button'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { ErrorBoundaryProps, router } from 'expo-router'
import { View } from 'react-native'
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  const handleMainMenu = () => {
    useLobbyStore.getState().resetErrors()
    router.replace('/')
  }
  const handleRetry = () => {
    useLobbyStore.getState().resetErrors()
    retry()
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GluestackUIProvider>
        <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
          <View className="flex-1 p-4 justify-center items-center gap-4">
            <Heading size="xl" className="text-center">
              Oops! Something went wrong
            </Heading>

            <Text className="text-center">
              There is an unexpected error. Please try again or restart the app if the problem persists.
            </Text>

            <View className="flex-row gap-2">
              <Button size="md" action="primary" onPress={handleMainMenu}>
                <ButtonText>Main menu</ButtonText>
              </Button>

              <Button size="md" action="primary" onPress={handleRetry}>
                <ButtonText>Try Again</ButtonText>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  )
}
