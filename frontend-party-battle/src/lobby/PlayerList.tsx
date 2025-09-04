import { Text, View } from 'react-native'

import { GameHistory, MAX_AMOUNT_OF_PLAYERS } from 'types-party-battle'
import { PlayerData } from './LobbyContent'
import PlayerListEntry from './PlayerListEntry'

interface LobbyScreenProps {
  players: [string, PlayerData][]
  gameHistories: [number, GameHistory][]
  currentPlayerId?: string
}

export default function PlayerList({
  players,
  gameHistories,
  currentPlayerId,
}: LobbyScreenProps) {
  const playerStats = players.map(([playerId, player]) => {
    let totalScore = 0
    let lastRoundScore = 0

    gameHistories.forEach(([, gameHistory]) => {
      const playerScore = gameHistory?.scores?.find(
        (score) => score.playerName === player.name
      )
      if (playerScore) {
        totalScore += playerScore.value
      }
    })

    if (gameHistories.length > 0) {
      const lastGame = gameHistories[gameHistories.length - 1][1]
      const playerLastScore = lastGame?.scores?.find(
        (score) => score.playerName === player.name
      )
      if (playerLastScore) {
        lastRoundScore = playerLastScore.value
      }
    }

    return {
      playerId,
      player,
      totalScore,
      lastRoundScore,
    }
  })

  const sortedPlayers = playerStats.sort((a, b) => b.totalScore - a.totalScore)

  const playersWithPlaces: ((typeof sortedPlayers)[0] & { place: number })[] =
    []
  for (let i = 0; i < sortedPlayers.length; i++) {
    let place = i + 1
    // If previous player has same score, use same place number
    if (
      i > 0 &&
      sortedPlayers[i].totalScore === sortedPlayers[i - 1].totalScore
    ) {
      place = playersWithPlaces[i - 1].place
    }
    playersWithPlaces.push({
      ...sortedPlayers[i],
      place,
    })
  }

  return (
    <View className="flex-1 justify-between pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Players ({players.length} / {MAX_AMOUNT_OF_PLAYERS})
        </Text>

        <View className="gap-2">
          {playersWithPlaces.map((playerStat) => {
            const isCurrentPlayer = playerStat.playerId === currentPlayerId
            return (
              <PlayerListEntry
                key={playerStat.playerId}
                player={playerStat.player}
                isCurrentPlayer={isCurrentPlayer}
                place={playerStat.place}
                totalScore={playerStat.totalScore}
                lastRoundScore={playerStat.lastRoundScore}
              />
            )
          })}
          {Array.from(
            { length: MAX_AMOUNT_OF_PLAYERS - players.length },
            (_, index) => {
              return (
                <PlayerListEntry
                  key={`placeholder-${index}`}
                  isCurrentPlayer={false}
                />
              )
            }
          )}
        </View>
      </View>
    </View>
  )
}
