import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useRef } from 'react'
import { Animated, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import DraggablePotato from './DraggablePotato'
import SideSlots from './SideSlots'
import TopRibbon from './TopRibbon'
import usePotatoLayout from './usePotatoLayout'
import { usePotatoOwnerEffect } from './usePotatoOwnerEffect'
import { usePotatoPanResponder } from './usePotatoPanResponder'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const { trimmedPlayerName } = usePlayerName()
  const message = useColyseusState(gameRoom, (state) => state.message)
  const playerWithPotato = useColyseusState(gameRoom, (state) => state.playerWithPotato)
  const status = useColyseusState(gameRoom, (state) => state.status)
  const remainingPlayers = useColyseusState(gameRoom, (state) => [...state.remainingPlayers])
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, trimmedPlayerName)

  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current

  const { safeAreaWidth, safeAreaHeight, radius, itemSize, halfCircleRibbonHeight } = usePotatoLayout()

  const { potatoPos, shouldShow } = usePotatoOwnerEffect(
    playerWithPotato,
    trimmedPlayerName,
    safeAreaWidth,
    safeAreaHeight,
    halfCircleRibbonHeight,
    itemSize,
    translateX,
    translateY,
    opacity
  )

  const panResponder = usePotatoPanResponder({
    status,
    canLeft: !!playerSlotAssignments.left,
    canRight: !!playerSlotAssignments.right,
    canAcross: !!playerSlotAssignments.top,
    gameRoom,
    safeAreaWidth,
    safeAreaHeight,
    translateX,
    translateY,
    opacity,
  })

  return (
    <BasicGameView>
      <View className="flex-1 relative">
        <TopRibbon
          radius={radius}
          itemSize={itemSize}
          message={message}
          playerSlotAssignments={playerSlotAssignments}
          playerWithPotato={playerWithPotato}
        />
        <SideSlots playerSlotAssignments={playerSlotAssignments} playerWithPotato={playerWithPotato} />
        <View className="flex-1 items-center">
          <View className="relative flex-1" style={{ width: safeAreaWidth - itemSize }}>
            <DraggablePotato
              shouldShow={shouldShow}
              potatoPos={potatoPos}
              translateX={translateX}
              translateY={translateY}
              opacity={opacity}
              panHandlers={panResponder.panHandlers}
            />
          </View>
        </View>
      </View>
    </BasicGameView>
  )
}
