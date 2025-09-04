import { GameType } from "./Game";
import { Score, ScoreSchema } from "./Score";

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
