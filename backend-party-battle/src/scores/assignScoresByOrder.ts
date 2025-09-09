import { Score } from "types-party-battle";

export function assignScoresByOrder(players: string[]): Score[] {
  return players.map((playerName, index) => ({
    playerName,
    value: index,
  }));
}
