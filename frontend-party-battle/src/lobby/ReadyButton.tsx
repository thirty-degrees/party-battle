import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { blurActiveElement } from '@/src/utils/focusUtils'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

export default function ReadyButton() {
  const { playerName } = usePlayerName()
  const { isCurrentPlayerReady, playerCount, sendLobbyRoomMessage } = useLobbyStore(
    useShallow((state) => ({
      isCurrentPlayerReady: Object.values(state.lobby.players).some(
        (player) => player.name === playerName && player.ready
      ),
      playerCount: Object.keys(state.lobby.players).length,
      sendLobbyRoomMessage: state.sendLobbyRoomMessage,
    }))
  )

  const handleToggleReady = () => {
    sendLobbyRoomMessage('SetPlayerReady', !isCurrentPlayerReady)
    blurActiveElement()
  }

  return (
    <View className="flex-col justify-end">
      <View className="flex-row w-full justify-center">
        <Button size="xl" action={'primary'} onPress={handleToggleReady}>
          <ButtonText>{isCurrentPlayerReady ? 'CANCEL' : 'PLAY'}</ButtonText>
        </Button>
      </View>

      <View className="h-8 justify-center items-center">
        {isCurrentPlayerReady && playerCount < 2 ? (
          <Text className="text-sm text-typography-600 dark:text-typography-400">
            Need 1 more player to start.
          </Text>
        ) : null}
      </View>
    </View>
  )
}
