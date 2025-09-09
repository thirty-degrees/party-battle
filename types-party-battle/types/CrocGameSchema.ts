import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "./GameSchema";
import { PlayerSchema } from "./PlayerSchema";

export class CrocGameSchema extends GameSchema {
  @type("number") teethCount: number = 0;
  @type(["number"]) pressedTeethIndex = new ArraySchema<number>();
  @type([PlayerSchema]) inGamePlayers = new ArraySchema<PlayerSchema>();
  @type("string") currentPlayer: string = "";
  @type("number") timeWhenTimerIsOver: number = 0;
}
