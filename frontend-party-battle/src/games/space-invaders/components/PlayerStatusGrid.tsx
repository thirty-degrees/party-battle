import { useMemo } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useSpaceInvadersStore } from '../useSpaceInvadersStore'
import { PlayerStatusItem } from './PlayerStatusItem'

export function PlayerStatusGrid() {
  const { players, remainingPlayers } = useSpaceInvadersStore(
    useShallow((s) => ({
      players: s.view.players,
      remainingPlayers: s.view.remainingPlayers,
    }))
  )

  const alivePlayers = useMemo(() => new Set(remainingPlayers), [remainingPlayers])

  if (players.length === 0) return null

  return (
    <View className="w-full px-6 pb-3">
      <View className="flex-col">
        {Array.from({ length: 2 }, (_, rowIndex) => (
          <View key={rowIndex} className="flex-row">
            {Array.from({ length: 4 }, (_, colIndex) => {
              const playerIndex = rowIndex * 4 + colIndex
              const player = players[playerIndex]
              const isPlaceholder = !player

              if (isPlaceholder) {
                return <PlayerStatusItem key={`placeholder-${playerIndex}`} isPlaceholder />
              }

              const isAlive = alivePlayers.has(player.name)
              return <PlayerStatusItem key={player.name} player={player} isAlive={isAlive} />
            })}
          </View>
        ))}
      </View>
    </View>
  )
}
