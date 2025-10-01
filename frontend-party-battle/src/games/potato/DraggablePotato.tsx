import { SwipeHint } from '@/components/swipe-hint'
import { usePlayerName, useSwipeHintVisibility } from '@/src/storage/userPreferencesStore'
import { useEffect, useRef, useState } from 'react'
import { Animated, Platform, View } from 'react-native'
import { PotatoDirection } from 'types-party-battle/types/potato/PotatoGameSchema'
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
  const { showSwipeHint, potatoSwipeCount, setPotatoSwipeCount } = useSwipeHintVisibility()
  const { playerWithPotato, status, sendMessage } = usePotatoGameStore(
    useShallow((state) => ({
      playerWithPotato: state.view.playerWithPotato,
      status: state.view.status,
      sendMessage: state.sendMessage,
    }))
  )
  const [playAnimation, setPlayAnimation] = useState(false)

  const { availableWidth, availableHeight, itemSize, halfCircleRibbonHeight } = usePotatoLayout()

  const onSwipe = (direction: PotatoDirection) => {
    sendMessage<PotatoDirection>('PassPotato', direction)
    setPotatoSwipeCount(potatoSwipeCount + 1)
    setPlayAnimation(false)
  }

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
    onSwipe,
  })

  useEffect(() => {
    if (shouldShow && potatoPos) {
      setPlayAnimation(true)
    }
  }, [shouldShow, potatoPos])

  if (!shouldShow || !potatoPos) return null

  const swipeHintWidth = 300
  const swipeHintHeight = swipeHintWidth / 4

  return (
    <View className="w-full h-full">
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
      {showSwipeHint && (
        <View
          style={{
            position: 'absolute',
            left: potatoPos.left + (POTATO_WIDTH - swipeHintHeight) / 2,
            top: potatoPos.top - swipeHintWidth * 0.65,
            width: swipeHintWidth,
            height: swipeHintWidth,
            paddingTop: canAcross ? 0 : swipeHintWidth - swipeHintHeight,
            transform: [{ rotate: canAcross ? '-90deg' : '0deg' }],
            pointerEvents: 'none',
          }}
        >
          <SwipeHint
            style={{ width: swipeHintWidth, height: swipeHintHeight }}
            playAnimation={playAnimation}
          />
        </View>
      )}
    </View>
  )
}
