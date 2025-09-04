import { Schema, type } from "@colyseus/schema";

export type GameType = "croc" | "snake";

export type GameStatus = "waiting" | "playing" | "finished";

export abstract class GameSchema extends Schema {
  @type("string") status: GameStatus;

  constructor(status: GameStatus) {
    super();
    this.status = status;
  }
}
