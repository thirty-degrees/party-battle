import { KeyValuePair } from "./Common";
import { GameType } from "./Game";

import { Schema, type } from "@colyseus/schema";

export class GameHistory extends Schema {
  @type("string") gameType: GameType;
  @type(["string", "string"]) scores: Array<KeyValuePair<string>> = [];

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}
