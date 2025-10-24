import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { useEffect, useMemo } from 'react'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type TimerProgressBarProps = {
  timeWhenTimerIsOver: number
  isActive: boolean
}

const AProgressFilledTrack = Animated.createAnimatedComponent(ProgressFilledTrack)

export default function TimerProgressBar({ timeWhenTimerIsOver, isActive }: TimerProgressBarProps) {
  const pct = useSharedValue(1)

  const duration = useMemo(() => {
    if (!isActive || timeWhenTimerIsOver === 0) return 0
    return Math.max(timeWhenTimerIsOver - Date.now(), 0)
  }, [timeWhenTimerIsOver, isActive])

  useEffect(() => {
    cancelAnimation(pct)
    if (!isActive || duration === 0) {
      pct.value = 1
      return
    }
    pct.value = withTiming(0, { duration, easing: Easing.linear })
  }, [duration, isActive, pct])

  const filledStyle = useAnimatedStyle(() => ({
    width: `${pct.value * 100}%`,
  }))

  return (
    <Progress value={100} size="md" orientation="horizontal">
      <AProgressFilledTrack style={filledStyle} className="bg-[#d31e26]" />
    </Progress>
  )
}
