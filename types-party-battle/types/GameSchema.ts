import { Schema, type } from "@colyseus/schema";

export type GameType = "croc" | "snake";

export type GameState = "waiting" | "playing" | "finished";

export abstract class GameSchema extends Schema {
  @type("string") gameState: GameState;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
  }
}
