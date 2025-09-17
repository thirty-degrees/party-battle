import React, { useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, View, ViewStyle } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

// Props to waltermvp (https://github.com/waltermvp/react-native-animated-border)
// copied bc of no activity since 2021

interface AnimatedBorderProps {
  children: React.ReactNode
  isActive: boolean
  borderColor?: string
  borderWidth?: number
  duration?: number
  borderRadius?: number
  style?: ViewStyle
}

export default function AnimatedBorder({
  children,
  isActive,
  borderColor = '#3b82f6',
  borderWidth = 2,
  duration = 1500,
  borderRadius = 0,
  style,
}: AnimatedBorderProps) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const progress = useSharedValue(0)

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize({ width, height })
  }, [])

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(progress)
      progress.value = 0
    }
  }, [isActive, progress])

  useEffect(() => {
    if (!isActive) return
    if (size.width === 0 || size.height === 0) return
    if (progress.value === 1) return
    progress.value = withTiming(1, { duration })
  }, [isActive, size.width, size.height, duration, progress])

  const bottomRightStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const bottomHalf = Math.min(halfBottom, s)
    return {
      position: 'absolute',
      bottom: 0,
      left: size.width / 2,
      height: borderWidth,
      width: bottomHalf,
      backgroundColor: borderColor,
      borderBottomRightRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  const bottomLeftStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const bottomHalf = Math.min(halfBottom, s)
    return {
      position: 'absolute',
      bottom: 0,
      left: size.width / 2 - bottomHalf,
      height: borderWidth,
      width: bottomHalf,
      backgroundColor: borderColor,
      borderBottomLeftRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  const rightStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const remAfterBottom = Math.max(0, s - halfBottom)
    const sideFill = Math.min(size.height, remAfterBottom)
    return {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: borderWidth,
      height: sideFill,
      backgroundColor: borderColor,
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  const leftStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const remAfterBottom = Math.max(0, s - halfBottom)
    const sideFill = Math.min(size.height, remAfterBottom)
    return {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: borderWidth,
      height: sideFill,
      backgroundColor: borderColor,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  const topRightStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const remAfterBottom = Math.max(0, s - halfBottom)
    const remAfterSide = Math.max(0, remAfterBottom - size.height)
    const topHalf = Math.min(size.width / 2, remAfterSide)
    return {
      position: 'absolute',
      top: 0,
      right: 0,
      height: borderWidth,
      width: topHalf,
      backgroundColor: borderColor,
      borderTopRightRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  const topLeftStyle = useAnimatedStyle(() => {
    const halfPerimeter = size.width + size.height
    const s = Math.max(0, Math.min(halfPerimeter, progress.value * halfPerimeter))
    const halfBottom = size.width / 2
    const remAfterBottom = Math.max(0, s - halfBottom)
    const remAfterSide = Math.max(0, remAfterBottom - size.height)
    const topHalf = Math.min(size.width / 2, remAfterSide)
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      height: borderWidth,
      width: topHalf,
      backgroundColor: borderColor,
      borderTopLeftRadius: borderRadius,
    }
  }, [size.width, size.height, borderWidth, borderColor, borderRadius])

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]} onLayout={onLayout}>
      {children}
      {isActive && size.width > 0 && size.height > 0 && (
        <>
          <Animated.View pointerEvents="none" style={bottomRightStyle} />
          <Animated.View pointerEvents="none" style={bottomLeftStyle} />
          <Animated.View pointerEvents="none" style={rightStyle} />
          <Animated.View pointerEvents="none" style={leftStyle} />
          <Animated.View pointerEvents="none" style={topRightStyle} />
          <Animated.View pointerEvents="none" style={topLeftStyle} />
        </>
      )}
    </View>
  )
}
