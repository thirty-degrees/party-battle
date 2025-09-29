import { Score } from 'types-party-battle/types/ScoreSchema'

/**
 * Assigns scores by rank group (top group highest, last group 0).
 * Players must be grouped by rank with the first group being the highest rank.
 * All players in the same group receive the same score. Scores decrease per group.
 *
 * Example:
 * assignScoresByRank([['p1'], ['p2', 'p3'], ['p4']])
 * // returns → [{ playerName: 'p1', value: 2 }, { playerName: 'p2', value: 1 }, { playerName: 'p3', value: 1 }, { playerName: 'p4', value: 0 }]
 *
 * @param playersByRankTopFirst Groups of player names ordered from highest to lowest rank.
 * @returns One score entry per player with values decreasing from top to bottom groups.
 */
export function assignScoresByRank(playersByRankTopFirst: string[][]): Score[] {
  const totalGroups = playersByRankTopFirst.length
  return playersByRankTopFirst.flatMap((group, index) => {
    const value = totalGroups - 1 - index
    return group.map((playerName) => ({ playerName, value }))
  })
}
