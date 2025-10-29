import { Text } from '@/components/ui/text'
import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

interface AnimatedCountdownNumberProps {
  value?: number | null
  size?: 'normal' | 'big'
}

export const AnimatedCountdownNumber = ({ value, size = 'normal' }: AnimatedCountdownNumberProps) => {
  const scale = useRef(new Animated.Value(0.6)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    scale.setValue(0.6)
    opacity.setValue(0)

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: value == null ? 0 : 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start()
  }, [value, opacity, scale])

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Text className={`${size === 'big' ? 'text-6xl' : 'text-4xl'} font-normal text-center`}>
        {value ?? ''}
      </Text>
    </Animated.View>
  )
}
