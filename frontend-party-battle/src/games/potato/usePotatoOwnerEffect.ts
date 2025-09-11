import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { PADDING, POTATO_HEIGHT, POTATO_WIDTH } from './constants'

export function usePotatoOwnerEffect(
  playerWithPotato: string | undefined,
  trimmedPlayerName: string,
  safeAreaWidth: number,
  safeAreaHeight: number,
  halfCircleRibbonHeight: number,
  itemSize: number,
  translateX: Animated.Value,
  translateY: Animated.Value,
  opacity: Animated.Value
) {
  const [potatoPos, setPotatoPos] = useState<{ left: number; top: number } | null>(null)
  const prevPlayerWithPotato = useRef<string | undefined>(undefined)

  useEffect(() => {
    const justReceived =
      playerWithPotato === trimmedPlayerName && prevPlayerWithPotato.current !== trimmedPlayerName

    if (justReceived) {
      translateX.setValue(0)
      translateY.setValue(0)
      opacity.setValue(1)

      const left = Math.random() * (safeAreaWidth - itemSize - POTATO_WIDTH)
      const top = Math.random() * (safeAreaHeight - halfCircleRibbonHeight - POTATO_HEIGHT - PADDING)
      setPotatoPos({ left, top })
    }

    prevPlayerWithPotato.current = playerWithPotato
  }, [
    halfCircleRibbonHeight,
    itemSize,
    opacity,
    playerWithPotato,
    safeAreaHeight,
    safeAreaWidth,
    translateX,
    translateY,
    trimmedPlayerName,
  ])

  const shouldShow =
    (playerWithPotato === trimmedPlayerName || prevPlayerWithPotato.current === trimmedPlayerName) &&
    !!potatoPos

  return { potatoPos, shouldShow }
}
