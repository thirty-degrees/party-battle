import { ArraySchema, Schema, type } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";

export type GameType = "pick-cards" | "snake" | "potato" | "color-reaction";

export type GameStatus = "waiting" | "playing" | "paused" | "finished";

export abstract class GameSchema extends Schema {
  @type([PlayerSchema]) players = new ArraySchema<PlayerSchema>();
  @type("string") status: GameStatus;

  constructor(status: GameStatus) {
    super();
    this.status = status;
  }
}
