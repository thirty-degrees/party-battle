import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useRef } from 'react'
import { Animated, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import DraggablePotato from './DraggablePotato'
import SideSlots from './SideSlots'
import TopRibbon from './TopRibbon'
import usePotatoLayout from './usePotatoLayout'
import { usePotatoOwnerEffect } from './usePotatoOwnerEffect'
import { usePotatoPanResponder } from './usePotatoPanResponder'
import { usePotatoGameStore } from './usePotatoStore'

export const PotatoGame: GameComponent = () => {
  const { playerName } = usePlayerName()
  const { message, playerWithPotato, status, remainingPlayers } = usePotatoGameStore(
    useShallow((state) => ({
      message: state.view.message,
      playerWithPotato: state.view.playerWithPotato,
      status: state.view.status,
      remainingPlayers: state.view.remainingPlayers,
    }))
  )
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, playerName)

  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current

  const { availableWidth, availableHeight, radius, itemSize, halfCircleRibbonHeight } = usePotatoLayout()

  const { potatoPos, shouldShow } = usePotatoOwnerEffect(
    playerWithPotato,
    playerName,
    availableWidth,
    availableHeight,
    halfCircleRibbonHeight,
    itemSize,
    translateX,
    translateY
  )

  const panResponder = usePotatoPanResponder({
    status,
    canLeft: !!playerSlotAssignments.left,
    canRight: !!playerSlotAssignments.right,
    canAcross: !!playerSlotAssignments.top,
    availableWidth,
    availableHeight,
    translateX,
    translateY,
  })

  return (
    <BasicGameView>
      <View className="flex-1 relative overflow-hidden">
        <TopRibbon
          radius={radius}
          itemSize={itemSize}
          message={message}
          playerSlotAssignments={playerSlotAssignments}
          playerWithPotato={playerWithPotato}
        />
        <SideSlots playerSlotAssignments={playerSlotAssignments} playerWithPotato={playerWithPotato} />
        <View className="flex-1 items-center">
          <View className="relative flex-1" style={{ width: availableWidth - itemSize }}>
            <DraggablePotato
              shouldShow={shouldShow}
              potatoPos={potatoPos}
              translateX={translateX}
              translateY={translateY}
              panHandlers={panResponder.panHandlers}
            />
          </View>
        </View>
      </View>
    </BasicGameView>
  )
}
