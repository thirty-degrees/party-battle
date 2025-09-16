import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GAME_VIEW_PADDING, MAX_GAME_WIDTH } from '../constants'

export default function usePotatoLayout() {
  const insets = useSafeAreaInsets()
  const [dimensions, setDimensions] = useState(Dimensions.get('window'))

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })
    return () => subscription?.remove()
  }, [])

  const safeAreaWidth = Math.min(
    dimensions.width - GAME_VIEW_PADDING - insets.left - insets.right,
    MAX_GAME_WIDTH
  )
  const safeAreaHeight = dimensions.height - insets.top - insets.bottom
  const radius = safeAreaWidth / 2
  const itemSize = safeAreaWidth / 5
  const halfCircleRibbonHeight = radius + itemSize / 2

  return { safeAreaWidth, safeAreaHeight, radius, itemSize, halfCircleRibbonHeight }
}
