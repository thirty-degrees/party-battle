import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SimonSide } from 'types-party-battle/types/simon-says/SimonSaysGameSchema'
import { BoxingGloveLeft } from './BoxingGloveLeft'
import { BoxingGloveRight } from './BoxingGloveRight'
import { CircularProgressBorder } from './CircularProgressBorder'

type SlidingBoxProps = {
  side: SimonSide | null | undefined
  isFinalSide: boolean
  durationMs?: number
  isProgressActive?: boolean
}

const CIRCLE_SIZE = 120
const SVG_WIDTH = 90
const SVG_HEIGHT = (SVG_WIDTH * 351) / 429
const HALF_SLIDE_DISTANCE = 50
const FULL_SLIDE_DISTANCE = 100
const ANIMATION_DURATION = 300

export function SlidingBox({ side, isFinalSide, durationMs = 0, isProgressActive = false }: SlidingBoxProps) {
  const translateX = useSharedValue(0)
  const [displayedSide, setDisplayedSide] = useState<SimonSide | null>(null)

  useEffect(() => {
    if (side === null || side === undefined) {
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
    } else {
      setDisplayedSide(side)
      const distance = isFinalSide ? FULL_SLIDE_DISTANCE : HALF_SLIDE_DISTANCE
      if (side === 'left') {
        translateX.value = withTiming(-distance, { duration: ANIMATION_DURATION })
      } else if (side === 'right') {
        translateX.value = withTiming(distance, { duration: ANIMATION_DURATION })
      }
    }
  }, [side, isFinalSide, translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const boxCenterOffset = (CIRCLE_SIZE - SVG_WIDTH) / 2
  const svgTopOffset = (CIRCLE_SIZE - SVG_HEIGHT) / 2

  return (
    <View className="items-center justify-center" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: boxCenterOffset,
            top: svgTopOffset,
            zIndex: 0,
          },
          animatedStyle,
        ]}
      >
        {displayedSide === 'left' ? (
          <BoxingGloveLeft width={SVG_WIDTH} height={SVG_HEIGHT} />
        ) : displayedSide === 'right' ? (
          <BoxingGloveRight width={SVG_WIDTH} height={SVG_HEIGHT} />
        ) : null}
      </Animated.View>
      <View className="absolute" style={{ zIndex: 1 }}>
        <CircularProgressBorder
          durationMs={durationMs}
          size={CIRCLE_SIZE}
          borderWidth={4}
          progressBorderColor="#000000"
          backgroundColor="#4B5563"
          strokeColor="#9CA3AF"
          isActive={isProgressActive && durationMs > 0}
        />
      </View>
    </View>
  )
}
