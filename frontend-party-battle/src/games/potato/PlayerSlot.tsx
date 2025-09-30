import { View } from 'react-native'
import { Text } from '../../../components/ui/text'
import PotatoStack from './PotatoStack'
import { usePotatoGameStore } from './usePotatoStore'

interface PlayerSlotProps {
  playerName?: string
  className?: string
}

export const PlayerSlot = ({ playerName, className }: PlayerSlotProps) => {
  const hasPotato = usePotatoGameStore<boolean>(
    (state) => !!state.view.playerWithPotato && state.view.playerWithPotato === playerName
  )

  if (!playerName) return null

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
