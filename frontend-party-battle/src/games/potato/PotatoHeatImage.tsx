import { Image } from 'expo-image'
import { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

export default function PotatoHeatImage() {
  const scaleAnim = useSharedValue(0.98)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }))

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withTiming(1.02, { duration: 430 }),
      -1, // -1 means infinite loop
      true // reverse the animation on each iteration
    )
  }, [scaleAnim])

  return (
    <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
      <Image
        style={{ width: '100%', height: '100%' }}
        source={require('../../../assets/images/potato/heat.png')}
      />
    </Animated.View>
  )
}
