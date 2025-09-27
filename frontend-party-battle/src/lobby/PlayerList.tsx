import { useMemo } from 'react'
import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { MAX_AMOUNT_OF_PLAYERS } from 'types-party-battle/consts/config'
import { useShallow } from 'zustand/react/shallow'
import PlayerListEntry from './PlayerListEntry'

export default function PlayerList() {
  const { players: playersMap, gameHistories } = useLobbyStore(
    useShallow((state) => ({
      players: state.lobby.players,
      gameHistories: state.lobby.gameHistories,
    }))
  )

  const players = useMemo(() => Object.values(playersMap), [playersMap])
  const { playerName: currentPlayerName } = usePlayerName()

  const playerStats = players.map((player) => {
    let totalScore = 0
    let lastRoundScore = 0

    gameHistories.forEach((gameHistory) => {
      const playerScore = gameHistory?.scores?.find((score) => score.playerName === player.name)
      if (playerScore) {
        totalScore += playerScore.value
      }
    })

    if (gameHistories.length > 0) {
      const lastGame = gameHistories[gameHistories.length - 1]
      const playerLastScore = lastGame?.scores?.find((score) => score.playerName === player.name)
      if (playerLastScore) {
        lastRoundScore = playerLastScore.value
      }
    }

    return {
      player,
      totalScore,
      lastRoundScore,
    }
  })

  const sortedPlayers = playerStats.sort((a, b) => b.totalScore - a.totalScore)

  const playersWithPlaces: ((typeof sortedPlayers)[0] & { place: number })[] = []
  for (let i = 0; i < sortedPlayers.length; i++) {
    let place = i + 1
    // If previous player has same score, use same place number
    if (i > 0 && sortedPlayers[i].totalScore === sortedPlayers[i - 1].totalScore) {
      place = playersWithPlaces[i - 1].place
    }
    playersWithPlaces.push({
      ...sortedPlayers[i],
      place,
    })
  }

  type RankTrend = 'risen' | 'fallen' | 'stayed'

  const prevPlaceByName = new Map<string, number>()
  if (gameHistories.length > 1) {
    const totalsByName = new Map<string, number>()
    players.forEach((p) => totalsByName.set(p.name, 0))

    gameHistories.slice(0, -1).forEach((gh) => {
      gh.scores?.forEach((s) => {
        totalsByName.set(s.playerName, (totalsByName.get(s.playerName) || 0) + s.value)
      })
    })

    const prevSorted = Array.from(players, (p) => ({
      name: p.name,
      total: totalsByName.get(p.name) || 0,
    })).sort((a, b) => b.total - a.total)

    const prevWithPlaces: { name: string; place: number }[] = []
    for (let i = 0; i < prevSorted.length; i++) {
      let place = i + 1
      if (i > 0 && prevSorted[i].total === prevSorted[i - 1].total) {
        place = prevWithPlaces[i - 1].place
      }
      prevWithPlaces.push({ name: prevSorted[i].name, place })
    }
    prevWithPlaces.forEach(({ name, place }) => prevPlaceByName.set(name, place))
  }

  return (
    <View className="flex-1 justify-between">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Players ({players.length} / {MAX_AMOUNT_OF_PLAYERS})
        </Text>

        <View>
          {playersWithPlaces.map((playerStat) => {
            const isCurrentPlayer = playerStat.player.name === currentPlayerName
            const prevPlaceExisting = prevPlaceByName.get(playerStat.player.name)
            const prevPlace =
              prevPlaceExisting !== undefined ? prevPlaceExisting : gameHistories.length > 0 ? 1 : undefined
            let rankTrend: RankTrend = 'stayed'
            if (prevPlace !== undefined) {
              if (playerStat.place < prevPlace) rankTrend = 'risen'
              else if (playerStat.place > prevPlace) rankTrend = 'fallen'
            }
            return (
              <PlayerListEntry
                key={playerStat.player.name}
                player={playerStat.player}
                isCurrentPlayer={isCurrentPlayer}
                place={playerStat.place}
                totalScore={playerStat.totalScore}
                lastRoundScore={playerStat.lastRoundScore}
                playerColor={playerStat.player.color}
                rankTrend={rankTrend}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}
