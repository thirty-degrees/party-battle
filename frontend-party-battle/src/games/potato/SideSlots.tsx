import { View } from 'react-native'
import { PlayerSlot } from './PlayerSlot'

type Props = {
  playerSlotAssignments: { left?: string; right?: string }
  playerWithPotato?: string
}

export default function SideSlots({ playerSlotAssignments, playerWithPotato }: Props) {
  return (
    <View className="absolute inset-x-0 top-1/2 flex-row justify-between">
      <PlayerSlot
        playerName={playerSlotAssignments.left}
        playerWithPotato={playerWithPotato}
        className="transform -rotate-90 w-[100] h-[100]"
      />
      <PlayerSlot
        playerName={playerSlotAssignments.right}
        playerWithPotato={playerWithPotato}
        className="transform rotate-90 w-[100] h-[100]"
      />
    </View>
  )
}
