import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useRef } from 'react'
import { Animated, Platform } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { POTATO_HEIGHT, POTATO_WIDTH } from './constants'
import PotatoStack from './PotatoStack'
import usePotatoLayout from './usePotatoLayout'
import { usePotatoOwnerEffect } from './usePotatoOwnerEffect'
import { usePotatoPanResponder } from './usePotatoPanResponder'
import { usePotatoGameStore } from './usePotatoStore'

type Props = {
  canLeft: boolean
  canRight: boolean
  canAcross: boolean
}

export default function DraggablePotato({ canLeft, canRight, canAcross }: Props) {
  const { playerName } = usePlayerName()
  const { playerWithPotato, status } = usePotatoGameStore(
    useShallow((state) => ({
      playerWithPotato: state.view.playerWithPotato,
      status: state.view.status,
    }))
  )

  const { availableWidth, availableHeight, itemSize, halfCircleRibbonHeight } = usePotatoLayout()

  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current

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
    canLeft,
    canRight,
    canAcross,
    availableWidth,
    availableHeight,
    translateX,
    translateY,
  })

  if (!shouldShow || !potatoPos) return null

  return (
    <Animated.View
      className="absolute"
      style={{
        left: potatoPos.left,
        top: potatoPos.top,
        width: POTATO_WIDTH,
        height: POTATO_HEIGHT,
        transform: [{ translateX }, { translateY }],
        ...(Platform.OS === 'web' ? { userSelect: 'none' } : {}),
      }}
      {...panResponder.panHandlers}
    >
      <PotatoStack style={{ width: POTATO_WIDTH, height: POTATO_HEIGHT }} />
    </Animated.View>
  )
}
