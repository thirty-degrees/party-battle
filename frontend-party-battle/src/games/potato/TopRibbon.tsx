import { Text } from 'react-native'
import HalfCircleRibbon, { ArcItem } from './HalfCircleRibbon'
import { PlayerSlot } from './PlayerSlot'

type Props = {
  radius: number
  itemSize: number
  message?: string
  playerSlotAssignments: {
    topLeft?: string
    topCenterLeft?: string
    top?: string
    topCenterRight?: string
    topRight?: string
  }
  playerWithPotato?: string
}

export default function TopRibbon({
  radius,
  itemSize,
  message,
  playerSlotAssignments,
  playerWithPotato,
}: Props) {
  const topItems: ArcItem[] = [
    {
      id: 'topLeft',
      element: (
        <PlayerSlot
          className="opacity-50 w-[100]"
          playerName={playerSlotAssignments.topLeft}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'topCenterLeft',
      element: (
        <PlayerSlot
          className="opacity-50 w-[100]"
          playerName={playerSlotAssignments.topCenterLeft}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'top',
      element: (
        <PlayerSlot
          className="w-[100]"
          playerName={playerSlotAssignments.top}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'topCenterRight',
      element: (
        <PlayerSlot
          className="opacity-50 w-[100]"
          playerName={playerSlotAssignments.topCenterRight}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'topRight',
      element: (
        <PlayerSlot
          className="opacity-50 w-[100]"
          playerName={playerSlotAssignments.topRight}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
  ]

  return (
    <HalfCircleRibbon
      radius={radius}
      itemSize={itemSize}
      items={topItems}
      centerItem={<Text className="text-5xl font-bold dark:text-white text-black">{message}</Text>}
    />
  )
}
