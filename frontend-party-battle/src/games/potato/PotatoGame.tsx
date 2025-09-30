import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import DraggablePotato from './DraggablePotato'
import SideSlots from './SideSlots'
import TopRibbon from './TopRibbon'
import usePotatoLayout from './usePotatoLayout'
import { usePotatoGameStore } from './usePotatoStore'

export const PotatoGame: GameComponent = () => {
  const { playerName } = usePlayerName()
  const remainingPlayers = usePotatoGameStore(useShallow((state) => state.view.remainingPlayers))
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, playerName)

  const { availableWidth, radius, itemSize } = usePotatoLayout()

  return (
    <BasicGameView>
      <View className="flex-1 relative overflow-hidden">
        <TopRibbon radius={radius} itemSize={itemSize} playerSlotAssignments={playerSlotAssignments} />
        <SideSlots playerSlotAssignments={playerSlotAssignments} />
        <View className="flex-1 items-center">
          <View className="relative flex-1" style={{ width: availableWidth - itemSize }}>
            <DraggablePotato
              canLeft={!!playerSlotAssignments.left}
              canRight={!!playerSlotAssignments.right}
              canAcross={!!playerSlotAssignments.top}
            />
          </View>
        </View>
      </View>
    </BasicGameView>
  )
}
