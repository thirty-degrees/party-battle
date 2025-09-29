import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from './useLobbyStore'

export function useTotalScores(): Record<string, number> {
  const players = useLobbyStore(
    useShallow((state) => Object.values(state.view.players).map((p: { name: string }) => p.name))
  )
  const gameHistories = useLobbyStore((state) => state.view.gameHistories)

  return players.reduce(
    (acc: Record<string, number>, player: string) => {
      acc[player] = gameHistories.reduce(
        (acc: number, gameHistory: { scores: { playerName: string; value: number }[] }) => {
          const score = gameHistory.scores.find(
            (s: { playerName: string; value: number }) => s.playerName === player
          )
          return acc + (score?.value || 0)
        },
        0
      )
      return acc
    },
    {} as Record<string, number>
  )
}
