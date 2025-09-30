import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import { useLeaveParty } from './useLeaveParty'
import { useLobbyStore } from './useLobbyStore'

export function ConnectionLostScreen() {
  const { canRetry, retry, isLoading } = useLobbyStore(
    useShallow((state) => ({
      canRetry: state.failedRetries < 1,
      retry: state.retry,
      isLoading: state.isLoading,
    }))
  )
  const { leaveParty } = useLeaveParty()

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center gap-4">
        <View>
          <Heading size="lg">Connection lost</Heading>
        </View>
        <View className="flex-row gap-2">
          <Button size="md" action="primary" onPress={leaveParty}>
            <ButtonText>Main Menu</ButtonText>
          </Button>
          {canRetry && (
            <Button size="md" action="primary" onPress={retry} isDisabled={isLoading}>
              <ButtonText>{isLoading ? 'Retrying...' : 'Retry'}</ButtonText>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
