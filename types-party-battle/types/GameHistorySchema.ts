import { GameType } from "./GameSchema";
import { Score, ScoreSchema, mapScoresStable } from "./ScoreSchema";

import { ArraySchema, Schema, type } from "@colyseus/schema";

export interface GameHistory {
  gameType: GameType;
  scores: Score[];
}

export class GameHistorySchema extends Schema {
  @type("string") gameType: GameType;
  @type([ScoreSchema]) scores = new ArraySchema<ScoreSchema>();

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}

export const mapGameHistoryStable = (
  gh: GameHistorySchema,
  prev?: GameHistory
): GameHistory => {
  const gameType = gh.gameType;
  const scores = mapScoresStable(gh.scores, prev?.scores);
  if (prev && prev.gameType === gameType && prev.scores === scores) return prev;
  return { gameType, scores };
};

export const mapGameHistoriesStable = (
  arr: ArraySchema<GameHistorySchema>,
  prev?: GameHistory[]
): GameHistory[] => {
  const len = arr.length;
  const prevArr = prev ?? [];
  let changed = prevArr.length !== len;
  let next = changed ? Array<GameHistory>(len) : prevArr;
  for (let i = 0; i < len; i++) {
    const item = mapGameHistoryStable(arr[i], prevArr[i]);
    if (!changed && item !== prevArr[i]) {
      changed = true;
      next = prevArr.slice(0, i);
      next[i] = item;
    } else if (changed) {
      next[i] = item;
    }
  }
  return changed ? next : prevArr;
};
