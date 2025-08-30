import { Schema, type } from "@colyseus/schema";

export type GameType = "croc" | "snake";

export type GameState = "waiting" | "playing" | "finished";

export abstract class Game extends Schema {
  @type("string") gameState: GameState = "waiting";
  @type("string") gameType: GameType;

  constructor(gameType: GameType) {
    super();
    this.gameType = gameType;
  }
}
