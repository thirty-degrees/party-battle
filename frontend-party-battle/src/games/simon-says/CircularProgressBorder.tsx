import { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type CircularProgressBorderProps = {
  durationMs: number
  size?: number
  borderWidth?: number
  progressBorderColor?: string
  backgroundColor?: string
  strokeColor?: string
  isActive?: boolean
}

export function CircularProgressBorder({
  durationMs,
  size = 120,
  borderWidth = 4,
  progressBorderColor = '#d31e26',
  backgroundColor = 'transparent',
  strokeColor,
  isActive = true,
}: CircularProgressBorderProps) {
  const progress = useSharedValue(0)

  const calculatedDuration = useMemo(() => {
    if (!isActive || durationMs <= 0) return 0
    return Math.max(0, durationMs)
  }, [durationMs, isActive])

  useEffect(() => {
    cancelAnimation(progress)
    if (!isActive || calculatedDuration === 0) {
      progress.value = 0
      return
    }
    progress.value = withTiming(1, { duration: calculatedDuration, easing: Easing.linear })
  }, [isActive, calculatedDuration, progress])

  const radius = (size - borderWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  const animatedProps = useAnimatedProps(() => {
    const progressValue = progress.value
    const strokeDashoffset = circumference * (1 - progressValue)
    return {
      strokeDashoffset,
    }
  })

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={size} height={size}>
        {backgroundColor !== 'transparent' && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill={backgroundColor}
            stroke={strokeColor}
            strokeWidth={borderWidth}
          />
        )}
        {isActive && calculatedDuration > 0 && (
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressBorderColor}
            strokeWidth={borderWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            animatedProps={animatedProps}
          />
        )}
      </Svg>
    </View>
  )
}
