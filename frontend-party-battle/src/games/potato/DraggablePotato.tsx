import { Animated, GestureResponderHandlers } from 'react-native'
import PotatoStack from './PotatoStack'
import { POTATO_HEIGHT, POTATO_WIDTH } from './constants'

type Props = {
  shouldShow: boolean
  potatoPos: { left: number; top: number } | null
  translateX: Animated.Value
  translateY: Animated.Value
  panHandlers: GestureResponderHandlers
}

export default function DraggablePotato({
  shouldShow,
  potatoPos,
  translateX,
  translateY,
  panHandlers,
}: Props) {
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
        userSelect: 'none',
      }}
      {...panHandlers}
    >
      <PotatoStack style={{ width: POTATO_WIDTH, height: POTATO_HEIGHT }} />
    </Animated.View>
  )
}
