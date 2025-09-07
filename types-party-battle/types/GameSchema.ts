import { ArraySchema, Schema, type } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";

export type GameType = "croc" | "snake";

export type GameStatus = "waiting" | "playing" | "finished";

export abstract class GameSchema extends Schema {
  @type([PlayerSchema]) players = new ArraySchema<PlayerSchema>();
  @type("string") status: GameStatus;

  constructor(status: GameStatus) {
    super();
    this.status = status;
  }
}
