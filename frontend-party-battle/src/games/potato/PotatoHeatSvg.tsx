import { useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  SvgProps,
} from 'react-native-svg'

const VB_W = 492.586
const VB_H = 656.724
const BASE_STDDEV = 7.613

export default function PotatoHeatSvg(props: SvgProps) {
  const [stdDev, setStdDev] = useState(BASE_STDDEV)
  const scaleAnim = useSharedValue(0.98)

  const animatedStyle = useAnimatedStyle(() => ({
    width: '100%',
    height: '100%',
    transform: [{ scale: scaleAnim.value }],
  }))

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    const scale = Math.min(width / VB_W, height / VB_H)
    const v = Platform.OS === 'ios' ? BASE_STDDEV * scale : BASE_STDDEV
    setStdDev(v)
  }, [])

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withTiming(1.02, { duration: 430 }),
      -1, // -1 means infinite loop
      true // reverse the animation on each iteration
    )
  }, [scaleAnim])

  return (
    <Animated.View style={animatedStyle} onLayout={onLayout}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} {...props}>
        <Defs>
          <RadialGradient
            id="b"
            cx={247.581}
            cy={336.441}
            r={236.978}
            fx={247.581}
            fy={336.441}
            gradientTransform="matrix(1.012 0 0 1.367 -2.869 -123.35)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0} stopColor="#e03f1c" />
            <Stop offset={1} stopColor="#f28922" />
          </RadialGradient>
          <LinearGradient
            id="a"
            x1={112.823}
            x2={602.102}
            y1={426.521}
            y2={623.364}
            gradientTransform="matrix(.895 0 0 .895 -52.46 -126.695)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.395} stopColor="#e03f1c" />
            <Stop offset={1} stopColor="#f28922" />
          </LinearGradient>

          <Filter
            id="c"
            x={-0.5}
            y={-0.5}
            width={2}
            height={2}
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <FeGaussianBlur stdDeviation={stdDev} />
          </Filter>
        </Defs>

        <Path
          fill="url(#b)"
          fillRule="evenodd"
          d="M276.605 14.509a225.127 225.127 0 0 1 20.287.312c42.493 2.482 83.515 17.255 111.803 50.025 33.605 38.93 49.86 100.713 40.49 151.238-4.361 23.513-12.49 37.896-7.786 62.42 3.545 18.488 11.614 33.976 19.262 50.71 7.555 16.529 13.152 33.38 16.64 51.157 1.58 7.706 3.984 15.338 5.07 23.142 8.221 59.122-6.982 126.824-41.24 176.01-10.179 13.415-23.385 25.727-35.746 36.974-11.722 9.15-29.54 20.115-43.469 27.087-38.703 15.594-110.347 16.352-152.622 13.726-52.035-5.208-90.106-14.115-129.269-50.062-21.145-19.41-47.233-56.762-57.147-83.56-18.324-50.803-16.203-108.642 6.84-157.938 12.563-26.876 29.607-43.234 37.491-71.726 2.496-14.537-2.494-35.13-4.128-49.462-2.752-24.137-.997-46.484 4.282-70.279 7.85-35.387 23.675-67.426 47.971-94.43 40.452-44.96 102.5-62.867 161.271-65.344Z"
          filter="url(#c)"
          transform="matrix(.965 0 0 .965 7.398 3.725)"
        />
      </Svg>
    </Animated.View>
  )
}
