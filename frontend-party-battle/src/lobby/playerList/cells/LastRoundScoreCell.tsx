import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { useLobbyStore } from '../../useLobbyStore'

type LastRoundScoreCellProps = {
  playerName: string
}

export function LastRoundScoreCell({ playerName }: LastRoundScoreCellProps) {
  const lastRoundScore = useLobbyStore(
    (state) =>
      state.view.gameHistories.at(-1)?.scores.find((score) => score.playerName === playerName)?.value ?? 0
  )

  return (
    <View className="w-8 items-end">
      <Text className={`text-black dark:text-white text-end`}>
        {lastRoundScore === 0 ? '' : `${lastRoundScore >= 0 ? '+' : ''}${lastRoundScore}`}
      </Text>
    </View>
  )
}
