import { Text } from 'react-native'
import PotatoStack from './PotatoStack'

interface PlayerSlotProps {
  playerName?: string
  playerWithPotato?: string
}

export const PlayerSlot = ({ playerName, playerWithPotato }: PlayerSlotProps) => {
  if (!playerName) return null

  const hasPotato = playerWithPotato && playerWithPotato === playerName

  return (
    <>
      <Text className="text-black dark:text-white text-md">{playerName}</Text>
      {hasPotato && <PotatoStack style={{ width: 50 }} />}
    </>
  )
}
