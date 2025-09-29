import { useMemo } from 'react'
import { Animated, PanResponder } from 'react-native'
import { PotatoDirection } from 'types-party-battle/types/potato/PotatoGameSchema'
import { useShallow } from 'zustand/react/shallow'
import { usePotatoGameStore } from './usePotatoStore'

type Args = {
  status: string | undefined
  canLeft: boolean
  canRight: boolean
  canAcross: boolean
  availableWidth: number
  availableHeight: number
  translateX: Animated.Value
  translateY: Animated.Value
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
}: Args) {
  const { sendMessage } = usePotatoGameStore(useShallow((state) => ({ sendMessage: state.sendMessage })))

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 || Math.abs(g.dy) > 20,
        onPanResponderRelease: (_, g) => {
          if (status !== 'playing') return

          if (Math.abs(g.dx) > Math.abs(g.dy)) {
            const dir: PotatoDirection = g.dx > 0 ? 'right' : 'left'
            const allowed = dir === 'right' ? canRight : canLeft
            if (!allowed) return
            sendMessage<PotatoDirection>('PassPotato', dir)
            const toX = dir === 'right' ? availableWidth : -availableWidth
            Animated.parallel([
              Animated.timing(translateX, { toValue: toX, duration: 500, useNativeDriver: true }),
            ]).start()
          } else if (g.dy < 0) {
            if (!canAcross) return
            sendMessage<PotatoDirection>('PassPotato', 'across')
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
    [
      status,
      canLeft,
      canRight,
      canAcross,
      sendMessage,
      availableWidth,
      availableHeight,
      translateX,
      translateY,
    ]
  )

  return panResponder
}
