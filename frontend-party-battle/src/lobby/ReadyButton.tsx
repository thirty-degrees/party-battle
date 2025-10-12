import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { blurActiveElement } from '@/src/utils/focusUtils'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

type ReadyButtonProps = {
  disabled?: boolean
}

export default function ReadyButton({ disabled }: ReadyButtonProps) {
  const { playerName } = usePlayerName()
  const { isCurrentPlayerReady, playerCount, sendMessage } = useLobbyStore(
    useShallow((state) => ({
      isCurrentPlayerReady: Object.values(state.view.players).some(
        (player: { name: string; ready?: boolean }) => player.name === playerName && player.ready
      ),
      playerCount: Object.keys(state.view.players).length,
      sendMessage: state.sendMessage,
    }))
  )

  const handleToggleReady = () => {
    sendMessage('SetPlayerReady', !isCurrentPlayerReady)
    blurActiveElement()
  }

  const requiresMorePlayers = isCurrentPlayerReady && playerCount < 2

  return (
    <View className="flex-col justify-end">
      <Button size="xl" action={'primary'} onPress={handleToggleReady} isDisabled={disabled}>
        <ButtonText>{isCurrentPlayerReady ? 'CANCEL' : 'PLAY'}</ButtonText>
      </Button>

      <View className="h-8 justify-center">
        <Text
          className={`text-sm text-typography-600 dark:text-typography-400 ${!requiresMorePlayers ? 'opacity-0 select-none' : ''}`}
        >
          Need 1 more player to start.
        </Text>
      </View>
    </View>
  )
}
