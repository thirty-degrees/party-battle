import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GAME_VIEW_PADDING, MAX_GAME_WIDTH } from './constants'

export default function useBasicGameViewDimensions() {
  const insets = useSafeAreaInsets()
  const [dimensions, setDimensions] = useState(Dimensions.get('window'))

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })
    return () => subscription?.remove()
  }, [])

  const availableWidth = Math.min(
    dimensions.width - insets.left - 2 * GAME_VIEW_PADDING - insets.right,
    MAX_GAME_WIDTH
  )
  const availableHeight = dimensions.height - insets.top - 2 * GAME_VIEW_PADDING - insets.bottom

  return { availableWidth, availableHeight }
}
