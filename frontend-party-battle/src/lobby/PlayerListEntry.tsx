import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon'
import { Text, View } from 'react-native'
import { PlayerData } from './LobbyContent'

interface PlayerListEntryProps {
  player?: PlayerData
  isCurrentPlayer: boolean
  place?: number
  totalScore?: number
  lastRoundScore?: number
  playerColor?: string
}

export default function PlayerListEntry({
  player,
  isCurrentPlayer,
  place,
  totalScore,
  lastRoundScore,
  playerColor,
}: PlayerListEntryProps) {
  const getBorderColor = () => {
    if (playerColor) {
      return playerColor
    }
    return '#d1d5db' // gray-300
  }

  const containerStyles =
    'rounded-lg p-3 mb-2 flex-row items-center border' + (!player ? ' border-dashed' : '')

  const textStyles = 'font-medium text-black dark:text-white'
  const nameStyles = isCurrentPlayer
    ? 'font-medium text-blue-600 dark:text-blue-400'
    : 'font-medium text-black dark:text-white'

  return (
    <View className={containerStyles} style={{ borderColor: getBorderColor() }}>
      <View className="flex-[1]">
        <Text className={textStyles}>{player ? `${place}.` : '...'}</Text>
      </View>

      <View className="flex-[3]">
        <Text className={nameStyles}>{player?.name ?? '...'}</Text>
      </View>

      <View className="flex-[2] items-center">
        <Text className={`${textStyles} text-center`}>
          {player && lastRoundScore !== undefined
            ? `${lastRoundScore >= 0 ? '+' : ''}${lastRoundScore}`
            : '...'}
        </Text>
      </View>

      <View className="flex-[2] items-center">
        <Text className={`${textStyles} text-center`}>
          {player && totalScore !== undefined ? totalScore : '...'}
        </Text>
      </View>

      <View className="flex-[1] items-center">
        {player ? (
          player.ready ? (
            <Text className={`${textStyles} text-center`}>
              <Icon as={CheckIcon} className="text-green-600 dark:text-green-100" />
            </Text>
          ) : (
            <Text className={`${textStyles} text-center`}>
              <Icon as={CloseIcon} className="text-red-600 dark:text-red-400" />
            </Text>
          )
        ) : (
          <Text className={`${textStyles} text-center`}>...</Text>
        )}
      </View>
    </View>
  )
}
