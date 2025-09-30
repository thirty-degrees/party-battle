import { View } from 'react-native'
import { PlayerSlot } from './PlayerSlot'

interface SideSlotsProps {
  playerSlotAssignments: { left?: string; right?: string }
}

export default function SideSlots({ playerSlotAssignments }: SideSlotsProps) {
  return (
    <View className="absolute inset-x-0 top-1/2 flex-row justify-between">
      <PlayerSlot playerName={playerSlotAssignments.left} className="transform -rotate-90 w-[100] h-[100]" />
      <PlayerSlot playerName={playerSlotAssignments.right} className="transform rotate-90 w-[100] h-[100]" />
    </View>
  )
}
