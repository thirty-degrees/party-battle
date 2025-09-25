import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { GAME_VIEW_PADDING } from '../constants'
import { POTATO_HEIGHT, POTATO_WIDTH } from './constants'

export function usePotatoOwnerEffect(
  playerWithPotato: string | undefined,
  playerName: string,
  availableWidth: number,
  availableHeight: number,
  halfCircleRibbonHeight: number,
  itemSize: number,
  translateX: Animated.Value,
  translateY: Animated.Value
) {
  const [potatoPos, setPotatoPos] = useState<{ left: number; top: number } | null>(null)
  const prevPlayerWithPotato = useRef<string | undefined>(undefined)

  useEffect(() => {
    const justReceived = playerWithPotato === playerName && prevPlayerWithPotato.current !== playerName

    if (justReceived) {
      translateX.setValue(0)
      translateY.setValue(0)

      const left = Math.random() * (availableWidth - itemSize - POTATO_WIDTH)
      const top =
        Math.random() * (availableHeight - halfCircleRibbonHeight - POTATO_HEIGHT - GAME_VIEW_PADDING)
      setPotatoPos({ left, top })
    }

    prevPlayerWithPotato.current = playerWithPotato
  }, [
    halfCircleRibbonHeight,
    itemSize,
    playerWithPotato,
    availableHeight,
    availableWidth,
    translateX,
    translateY,
    playerName,
  ])

  const shouldShow =
    (playerWithPotato === playerName || prevPlayerWithPotato.current === playerName) && !!potatoPos

  return { potatoPos, shouldShow }
}
