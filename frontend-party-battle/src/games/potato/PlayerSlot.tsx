import { View } from 'react-native'
import { Text } from '../../../components/ui/text'
import PotatoStack from './PotatoStack'

interface PlayerSlotProps {
  playerName?: string
  playerWithPotato?: string
  className?: string
}

export const PlayerSlot = ({ playerName, playerWithPotato, className }: PlayerSlotProps) => {
  if (!playerName) return null

  const hasPotato = playerWithPotato && playerWithPotato === playerName

  return (
    <View className={className}>
      <View className="items-center">
        <Text className="text-black dark:text-white text-2xs">{playerName}</Text>
        {hasPotato ? (
          <PotatoStack style={{ width: 50, height: 67 }} />
        ) : (
          <View style={{ width: 50, height: 67 }} />
        )}
      </View>
    </View>
  )
}
