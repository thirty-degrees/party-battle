import React, { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  children: React.ReactNode
  run: boolean
}

export function ShakingScreen({ children, run }: Props) {
  const offset = useSharedValue<number>(0)

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  useEffect(() => {
    if (run) {
      const OFFSET = 12
      const D = 150
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: D }),
        withRepeat(withTiming(OFFSET, { duration: D }), 6, true),
        withTiming(0, { duration: D })
      )
    }
  }, [run, offset])

  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>
}
