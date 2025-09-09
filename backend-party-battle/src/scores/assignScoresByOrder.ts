import { Score } from "types-party-battle";

export function assignScoresByOrder(players: string[][]): Score[] {
  const result: Score[] = [];
  let currentScore = 0;

  for (const rankGroup of players) {
    const groupScore = currentScore + (rankGroup.length - 1);
    for (const playerName of rankGroup) {
      result.push({
        playerName,
        value: groupScore,
      });
    }
    currentScore += rankGroup.length;
  }

  return result;
}
