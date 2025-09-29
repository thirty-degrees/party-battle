import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from './useLobbyStore'

export function ConnectionLostScreen() {
  const { canRetry, retryJoinLobbyRoom, isLoading, leaveLobbyRoom } = useLobbyStore(
    useShallow((state) => ({
      canRetry: state.failedRetries < 1,
      retryJoinLobbyRoom: state.retryJoinLobbyRoom,
      isLoading: state.isLoading,
      leaveLobbyRoom: state.leaveLobbyRoom,
    }))
  )

  const router = useRouter()

  const handleLeaveParty = async () => {
    await leaveLobbyRoom()
    router.push('/')
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center gap-4">
        <View>
          <Heading size="lg">Connection lost</Heading>
        </View>
        <View className="flex-row gap-2">
          <Button size="md" action="primary" onPress={handleLeaveParty}>
            <ButtonText>Main Menu</ButtonText>
          </Button>
          {canRetry && (
            <Button size="md" action="primary" onPress={retryJoinLobbyRoom} isDisabled={isLoading}>
              <ButtonText>{isLoading ? 'Retrying...' : 'Retry'}</ButtonText>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
