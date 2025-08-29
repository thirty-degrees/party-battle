import { Schema, type } from "@colyseus/schema";

export type GameType = "croc" | "snake";

export abstract class Game extends Schema {
  @type("string") gameType: GameType;

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}
