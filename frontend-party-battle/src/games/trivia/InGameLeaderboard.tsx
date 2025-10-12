import { CrownIcon, Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useMemo } from 'react'
import { View } from 'react-native'

type Player = {
  name: string
}

type Score = {
  playerName: string
  value: number
}

type Props = {
  players: Player[]
  playerScores?: Score[]
}

export function InGameLeaderboard({ players, playerScores }: Props) {
  const playerNameToScore = useMemo(() => {
    const map = new Map<string, number>()
    playerScores?.forEach((entry) => {
      map.set(entry.playerName, entry.value)
    })
    return map
  }, [playerScores])

  const playersWithScores = useMemo(() => {
    return players.map((p) => ({
      name: p.name,
      score: playerNameToScore.get(p.name) ?? 0,
    }))
  }, [players, playerNameToScore])

  const highestScore = useMemo(() => {
    if (playersWithScores.length === 0) return 0
    return Math.max(...playersWithScores.map((p) => p.score))
  }, [playersWithScores])

  const slots = Array.from({ length: 8 }, (_, i) => playersWithScores[i] || null)
  const topRow = slots.slice(0, 4)
  const bottomRow = slots.slice(4, 8)

  const renderCell = (player: { name: string; score: number } | null, index: number) => {
    if (player) {
      const isHighest = player.score === highestScore && highestScore > 0
      return (
        <View key={player.name} className="flex-1 items-center px-2 py-2">
          <View className="flex-row items-center gap-2">
            {isHighest ? (
              <Icon as={CrownIcon} size="xl" className="text-yellow-400" />
            ) : (
              <View className="w-6 h-6" />
            )}
            <Text className="text-sm font-semibold text-white">{player.name}</Text>
          </View>
          <Text className="text-sm text-white/80">{player.score}</Text>
        </View>
      )
    }
    return null
  }

  return (
    <View className="absolute top-0 left-0 right-0 p-2">
      <Text className="text-4xl font-bold text-white text-center mb-5">Trivia</Text>
      <View className="flex-row border-b border-t border-white/20 pb-2">
        {topRow.map((player, index) => renderCell(player, index))}
      </View>
      <View className="flex-row pt-2">{bottomRow.map((player, index) => renderCell(player, index + 4))}</View>
    </View>
  )
}
