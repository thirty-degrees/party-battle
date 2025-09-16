import { Score } from 'types-party-battle/types/ScoreSchema'

export function assignScoresByOrder(players: string[][]): Score[] {
  let offset = 0

  return players.flatMap((group) => {
    const value = offset + group.length - 1
    offset += group.length
    return group.map((playerName) => ({ playerName, value }))
  })
}
