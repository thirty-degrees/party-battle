import AnimatedBorder from '@/components/animated-border/index'
import LeaderBoardDownRankIndicatorSvgComponent from '@/components/leaderboard/LeaderBoardDownRankIndicatorSvgComponent'
import LeaderBoardUpRankIndicatorSvgComponent from '@/components/leaderboard/LeaderBoardUpRankIndicatorSvgComponent'
import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LobbyPlayer } from 'types-party-battle/types/LobbyPlayerSchema'
import { RGBColor, rgbColorToString } from 'types-party-battle/types/RGBColorSchema'

interface PlayerListEntryProps {
  player: LobbyPlayer
  isCurrentPlayer: boolean
  place: number
  totalScore: number
  lastRoundScore: number
  playerColor: RGBColor
  rankTrend: 'risen' | 'fallen' | 'stayed'
}

export default function PlayerListEntry({
  player,
  isCurrentPlayer,
  place,
  totalScore,
  lastRoundScore,
  playerColor,
  rankTrend,
}: PlayerListEntryProps) {
  const textStyles = 'font-medium text-black dark:text-white'
  const nameStyles = 'font-medium text-black dark:text-white'

  const [localTrendWindowActive, setLocalTrendWindowActive] = useState(false)
  const localTrendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (localTrendTimerRef.current) clearTimeout(localTrendTimerRef.current)
    if (rankTrend === 'risen' || rankTrend === 'fallen') {
      setLocalTrendWindowActive(true)
      localTrendTimerRef.current = setTimeout(() => setLocalTrendWindowActive(false), 3000)
    } else {
      setLocalTrendWindowActive(false)
    }
    return () => {
      if (localTrendTimerRef.current) clearTimeout(localTrendTimerRef.current)
    }
  }, [rankTrend])

  const showRankTrend = localTrendWindowActive && (rankTrend === 'risen' || rankTrend === 'fallen')
  const indicatorProgress = useSharedValue(showRankTrend ? 1 : 0)

  useEffect(() => {
    indicatorProgress.value = withTiming(showRankTrend ? 1 : 0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    })
  }, [indicatorProgress, showRankTrend])

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: indicatorProgress.value,
    transform: [{ translateY: (1 - indicatorProgress.value) * 6 }],
  }))

  const placeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - indicatorProgress.value,
    transform: [{ translateY: indicatorProgress.value * -6 }],
  }))

  const playerColorString = rgbColorToString(playerColor)

  return (
    <AnimatedBorder
      isActive={player.ready}
      borderColor={playerColorString}
      borderWidth={2}
      borderRadius={4}
      duration={1000}
      style={{ marginBottom: 8 }}
    >
      <View
        className={`p-3 rounded border border-outline-200 dark:border-outline-800 flex-row items-center ${isCurrentPlayer ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
      >
        <View className="w-4 h-4 items-center justify-center relative">
          <Animated.View style={[{ position: 'absolute' }, indicatorAnimatedStyle]}>
            {showRankTrend ? (
              rankTrend === 'risen' ? (
                <LeaderBoardUpRankIndicatorSvgComponent width={14} height={14} />
              ) : (
                <LeaderBoardDownRankIndicatorSvgComponent width={14} height={14} />
              )
            ) : null}
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, placeAnimatedStyle]}>
            <Text className={textStyles}>{place}</Text>
          </Animated.View>
        </View>

        <View className="flex-1 flex-row justify-start gap-2 items-center ml-3">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: playerColorString }} />
          <Text className={nameStyles}>{player.name}</Text>
        </View>

        <View className="flex-row gap-4">
          <View className="w-6 items-center">
            <Text className={`${textStyles} text-center`} numberOfLines={1}>
              {lastRoundScore === 0 ? '' : `${lastRoundScore >= 0 ? '+' : ''}${lastRoundScore}`}
            </Text>
          </View>

          <View className="w-4 items-center">
            <Text className={`${textStyles} text-center`}>{totalScore}</Text>
          </View>
        </View>
      </View>
    </AnimatedBorder>
  )
}
