import { useMemo } from 'react'
import { Animated, PanResponder } from 'react-native'
import { PotatoDirection } from 'types-party-battle/types/potato/PotatoGameSchema'

type Args = {
  status: string | undefined
  canLeft: boolean
  canRight: boolean
  canAcross: boolean
  availableWidth: number
  availableHeight: number
  translateX: Animated.Value
  translateY: Animated.Value
  onSwipe: (direction: PotatoDirection) => void
}

export function usePotatoPanResponder({
  status,
  canLeft,
  canRight,
  canAcross,
  availableWidth,
  availableHeight,
  translateX,
  translateY,
  onSwipe,
}: Args) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 || Math.abs(g.dy) > 20,
        onPanResponderRelease: (_, g) => {
          if (status !== 'playing') {
            translateX.setValue(0)
            translateY.setValue(0)
            return
          }

          if (Math.abs(g.dx) > Math.abs(g.dy)) {
            const dir: PotatoDirection = g.dx > 0 ? 'right' : 'left'
            const allowed = dir === 'right' ? canRight : canLeft
            if (!allowed) return
            onSwipe(dir)
            const toX = dir === 'right' ? availableWidth : -availableWidth
            Animated.parallel([
              Animated.timing(translateX, { toValue: toX, duration: 500, useNativeDriver: true }),
            ]).start()
          } else if (g.dy < 0) {
            if (!canAcross) return
            onSwipe('across')
            Animated.parallel([
              Animated.timing(translateY, {
                toValue: -availableHeight,
                duration: 500,
                useNativeDriver: true,
              }),
            ]).start()
          }
        },
      }),
    [status, canLeft, canRight, canAcross, onSwipe, availableWidth, availableHeight, translateX, translateY]
  )

  return panResponder
}
