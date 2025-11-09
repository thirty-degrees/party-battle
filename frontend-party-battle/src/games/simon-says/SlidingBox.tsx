import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SimonSide } from 'types-party-battle/types/simon-says/SimonSaysGameSchema'

type SlidingBoxProps = {
  side: SimonSide | null | undefined
  isFinalSide: boolean
}

const CIRCLE_SIZE = 120
const BOX_SIZE = 50
const HALF_SLIDE_DISTANCE = 50
const FULL_SLIDE_DISTANCE = 100
const ANIMATION_DURATION = 300

export function SlidingBox({ side, isFinalSide }: SlidingBoxProps) {
  const translateX = useSharedValue(0)

  useEffect(() => {
    if (side === null || side === undefined) {
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
    } else if (side === 'left') {
      const distance = isFinalSide ? FULL_SLIDE_DISTANCE : HALF_SLIDE_DISTANCE
      translateX.value = withTiming(-distance, { duration: ANIMATION_DURATION })
    } else if (side === 'right') {
      const distance = isFinalSide ? FULL_SLIDE_DISTANCE : HALF_SLIDE_DISTANCE
      translateX.value = withTiming(distance, { duration: ANIMATION_DURATION })
    }
  }, [side, isFinalSide, translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const boxCenterOffset = (CIRCLE_SIZE - BOX_SIZE) / 2

  return (
    <View className="items-center justify-center" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: BOX_SIZE,
            height: BOX_SIZE,
            left: boxCenterOffset,
            top: boxCenterOffset,
            backgroundColor: '#4b5563',
            borderWidth: 3,
            borderColor: '#000000',
            borderRadius: 8,
            zIndex: 1,
          },
          animatedStyle,
        ]}
      />
      <View
        className="absolute rounded-full border-4 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
        style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, zIndex: 2 }}
      />
    </View>
  )
}
