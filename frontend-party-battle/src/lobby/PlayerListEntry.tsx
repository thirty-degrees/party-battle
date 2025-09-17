import AnimatedBorder from '@/components/animated-border/index'
import { Text, View } from 'react-native'
import { PlayerData } from './LobbyContent'

interface PlayerListEntryProps {
  player: PlayerData
  isCurrentPlayer: boolean
  place: number
  totalScore: number
  lastRoundScore: number
  playerColor: string
}

export default function PlayerListEntry({
  player,
  isCurrentPlayer,
  place,
  totalScore,
  lastRoundScore,
  playerColor,
}: PlayerListEntryProps) {
  const textStyles = 'font-medium text-black dark:text-white'
  const nameStyles = 'font-medium text-black dark:text-white'

  return (
    <AnimatedBorder
      isActive={player.ready}
      borderColor={playerColor}
      borderWidth={2}
      borderRadius={4}
      duration={2000}
      style={{ marginBottom: 8 }}
    >
      <View
        className={`p-3 rounded border border-outline-200 dark:border-outline-800 flex-row items-center ${isCurrentPlayer ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
      >
        <View className="w-2 items-center">
          <Text className={textStyles}>{place}</Text>
        </View>

        <View className="flex-1 flex-row justify-start gap-1 items-center ml-3">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: playerColor }} />
          <Text className={nameStyles}>{player.name}</Text>
        </View>

        <View className="flex-row gap-4">
          <View className="w-2 items-center">
            <Text className={`${textStyles} text-center`}>
              {lastRoundScore === 0 ? '' : `${lastRoundScore >= 0 ? '+' : ''}${lastRoundScore}`}
            </Text>
          </View>

          <View className="w-4 items-center">
            <Text className={`${textStyles} text-center`}>{totalScore}</Text>
          </View>
        </View>
      </View>
    </AnimatedBorder>
  )
}
