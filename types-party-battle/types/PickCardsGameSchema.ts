import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "./GameSchema";
import { PlayerSchema } from "./PlayerSchema";

export class PickCardsGameSchema extends GameSchema {
  @type("number") cardCount: number = 0;
  @type(["number"]) pressedCardIndex = new ArraySchema<number>();
  @type([PlayerSchema]) inGamePlayers = new ArraySchema<PlayerSchema>();
  @type("string") currentPlayer: string = "";
  @type("number") timeWhenTimerIsOver: number = 0;
}
