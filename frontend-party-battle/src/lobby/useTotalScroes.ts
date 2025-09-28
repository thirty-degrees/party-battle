import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from './useLobbyStore'

export function useTotalScores(): Record<string, number> {
  const players = useLobbyStore(useShallow((state) => Object.values(state.lobby.players).map((p) => p.name)))
  const gameHistories = useLobbyStore((state) => state.lobby.gameHistories)

  return players.reduce(
    (acc, player) => {
      acc[player] = gameHistories.reduce((acc, gameHistory) => {
        const score = gameHistory.scores.find((s) => s.playerName === player)
        return acc + (score?.value || 0)
      }, 0)
      return acc
    },
    {} as Record<string, number>
  )
}
