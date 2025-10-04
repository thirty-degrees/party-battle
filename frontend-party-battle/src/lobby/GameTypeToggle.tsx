import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { View } from 'react-native'
import { GameType } from 'types-party-battle/types/GameSchema'
import { useShallow } from 'zustand/react/shallow'

const GAME_TYPE_NAMES: Record<GameType, string> = {
  'pick-cards': 'Pick Cards',
  snake: 'Snake',
  potato: 'Hot Potato',
  'color-reaction': 'Color Reaction',
}

export function GameTypeToggle({ gameType }: { gameType: GameType }) {
  const { isEnabled, sendMessage } = useLobbyStore(
    useShallow((state) => ({
      isEnabled: state.view.enabledGameTypes.includes(gameType),
      sendMessage: state.sendMessage,
    }))
  )

  const handleToggle = (enabled: boolean) => {
    sendMessage('SetEnableGameType', { gameType, enabled })
  }

  return (
    <View className="flex-row items-center justify-between p-3 bg-background-50 dark:bg-background-900 rounded-lg">
      <Text className="text-base text-typography-800 dark:text-typography-200">
        {GAME_TYPE_NAMES[gameType]}
      </Text>
      <Switch value={isEnabled} onValueChange={handleToggle} />
    </View>
  )
}
