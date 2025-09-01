import { KeyValuePair } from "./Common";
import { GameType } from "./Game";

import { Schema, type } from "@colyseus/schema";

export class GameHistory extends Schema {
  @type("string") gameType: GameType;
  @type(["string", "number"]) scores: Array<KeyValuePair<number>> = [];

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}
