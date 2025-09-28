import LeaderBoardDownRankIndicatorSvgComponent from '@/components/leaderboard/LeaderBoardDownRankIndicatorSvgComponent'
import LeaderBoardUpRankIndicatorSvgComponent from '@/components/leaderboard/LeaderBoardUpRankIndicatorSvgComponent'
import { Text } from '@/components/ui/text'
import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from '../../useLobbyStore'

type RankTrend = 'risen' | 'fallen' | 'stayed'

type PlaceCellProps = {
  playerName: string
}

export function PlaceCell({ playerName }: PlaceCellProps) {
  const players = useLobbyStore(useShallow((state) => Object.values(state.lobby.players).map((p) => p.name)))
  const gameHistories = useLobbyStore(useShallow((state) => state.lobby.gameHistories))

  const { place, rankTrend } = useMemo(() => {
    const totals = new Map<string, number>()
    players.forEach((p) => totals.set(p, 0))
    gameHistories.forEach((gh) => {
      gh?.scores?.forEach((s) => totals.set(s.playerName, (totals.get(s.playerName) || 0) + s.value))
    })
    const sorted = Array.from(players, (p) => ({
      name: p,
      total: totals.get(p) || 0,
    })).sort((a, b) => b.total - a.total)
    let currentPlace = 0
    for (let i = 0; i < sorted.length; i++) {
      let placeNum = i + 1
      if (i > 0 && sorted[i].total === sorted[i - 1].total) {
        const prev = sorted[i - 1]
        const prevIdx = sorted.findIndex((x) => x.name === prev.name)
        placeNum = prevIdx + 1
        for (let j = prevIdx; j >= 1 && sorted[j].total === sorted[j - 1].total; j--) {
          placeNum = j
        }
      }
      if (sorted[i].name === playerName) {
        currentPlace = placeNum
        break
      }
    }
    let trend: RankTrend = 'stayed'
    if (gameHistories.length === 0) {
      trend = 'stayed'
    } else {
      const prevTotals = new Map<string, number>()
      players.forEach((p) => prevTotals.set(p, 0))
      gameHistories.slice(0, -1).forEach((gh) => {
        gh?.scores?.forEach((s) =>
          prevTotals.set(s.playerName, (prevTotals.get(s.playerName) || 0) + s.value)
        )
      })
      const prevSorted = Array.from(players, (p) => ({
        name: p,
        total: prevTotals.get(p) || 0,
      })).sort((a, b) => b.total - a.total)
      const prevPlaceByName = new Map<string, number>()
      for (let i = 0; i < prevSorted.length; i++) {
        let placeNum = i + 1
        if (i > 0 && prevSorted[i].total === prevSorted[i - 1].total) {
          const prev = prevSorted[i - 1]
          placeNum = prevPlaceByName.get(prev.name) || placeNum
        }
        prevPlaceByName.set(prevSorted[i].name, placeNum)
      }
      const prevPlace = prevPlaceByName.has(playerName)
        ? prevPlaceByName.get(playerName)!
        : gameHistories.length > 0
          ? 1
          : undefined
      if (prevPlace !== undefined) {
        if (currentPlace < prevPlace) trend = 'risen'
        else if (currentPlace > prevPlace) trend = 'fallen'
        else trend = 'stayed'
      }
    }
    return { place: currentPlace, rankTrend: trend }
  }, [players, gameHistories, playerName])

  const [localTrendWindowActive, setLocalTrendWindowActive] = useState(false)
  useEffect(() => {
    if (rankTrend === 'risen' || rankTrend === 'fallen') {
      setLocalTrendWindowActive(true)
      const id = setTimeout(() => setLocalTrendWindowActive(false), 3000)
      return () => clearTimeout(id)
    }
    setLocalTrendWindowActive(false)
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

  return (
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
        <Text className={'text-black dark:text-white'}>{place}</Text>
      </Animated.View>
    </View>
  )
}
