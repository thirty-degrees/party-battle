import { CloseIcon, Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { Player } from 'types-party-battle/types/PlayerSchema'
import { rgbColorToString } from 'types-party-battle/types/RGBColorSchema'

interface PlayerStatusItemProps {
  player?: Player
  isAlive?: boolean
  isPlaceholder?: boolean
}

export function PlayerStatusItem({ player, isAlive = true, isPlaceholder = false }: PlayerStatusItemProps) {
  if (isPlaceholder) {
    return (
      <View className="w-1/4 items-center">
        <View className="relative items-center py-1.5 min-h-[15px]">
          <Text className="text-center text-xs font-semibold text-gray-400">-</Text>
        </View>
      </View>
    )
  }

  if (!player) return null

  const textClass = isAlive
    ? 'text-center text-xs font-semibold'
    : 'text-center text-xs font-semibold text-gray-400 line-through'
  const textColor = { color: rgbColorToString(player.color) }

  return (
    <View className="w-1/4 items-center">
      <View className="relative items-center py-1.5 min-h-[15px]">
        {isAlive ? (
          <Text className={textClass} style={textColor}>
            {player.name}
          </Text>
        ) : (
          <View className="flex-row items-center justify-center">
            <Icon as={CloseIcon} size="sm" className="text-red-500 mr-1" />
            <Text className={textClass} style={textColor}>
              {player.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
