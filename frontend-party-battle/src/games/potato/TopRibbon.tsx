import HalfCircleRibbon, { ArcItem } from './HalfCircleRibbon'
import MessageDisplay from './MessageDisplay'
import { PlayerSlot } from './PlayerSlot'

interface TopRibbonProps {
  radius: number
  itemSize: number
  playerSlotAssignments: {
    topLeft?: string
    topCenterLeft?: string
    top?: string
    topCenterRight?: string
    topRight?: string
  }
}

export default function TopRibbon({ radius, itemSize, playerSlotAssignments }: TopRibbonProps) {
  const topItems: ArcItem[] = [
    {
      id: 'topLeft',
      element: <PlayerSlot className="opacity-50 w-[100]" playerName={playerSlotAssignments.topLeft} />,
    },
    {
      id: 'topCenterLeft',
      element: <PlayerSlot className="opacity-50 w-[100]" playerName={playerSlotAssignments.topCenterLeft} />,
    },
    {
      id: 'top',
      element: <PlayerSlot className="w-[100]" playerName={playerSlotAssignments.top} />,
    },
    {
      id: 'topCenterRight',
      element: (
        <PlayerSlot className="opacity-50 w-[100]" playerName={playerSlotAssignments.topCenterRight} />
      ),
    },
    {
      id: 'topRight',
      element: <PlayerSlot className="opacity-50 w-[100]" playerName={playerSlotAssignments.topRight} />,
    },
  ]

  return (
    <HalfCircleRibbon radius={radius} itemSize={itemSize} items={topItems} centerItem={<MessageDisplay />} />
  )
}
