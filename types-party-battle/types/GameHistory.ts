import { KeyValuePairNumber } from "./Common";
import { GameType } from "./Game";

import { ArraySchema, Schema, type } from "@colyseus/schema";

export class GameHistory extends Schema {
  @type("string") gameType: GameType;
  @type([KeyValuePairNumber]) scores = new ArraySchema<KeyValuePairNumber>();

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}
