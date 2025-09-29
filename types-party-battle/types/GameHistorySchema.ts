import { GameType } from "./GameSchema";
import { mapArrayStable } from "./mapArrayStable";
import { Score, ScoreSchema, mapScoreStable } from "./ScoreSchema";

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
  const scores = mapArrayStable(gh.scores, prev?.scores, mapScoreStable);
  if (prev && prev.gameType === gameType && prev.scores === scores) return prev;
  return { gameType, scores };
};
