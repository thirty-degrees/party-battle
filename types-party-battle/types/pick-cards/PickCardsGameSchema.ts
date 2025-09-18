import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "../GameSchema";

export class PickCardsGameSchema extends GameSchema {
  @type("number") cardCount: number = 0;
  @type(["number"]) pressedCardIndex = new ArraySchema<number>();
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") currentPlayer: string = "";
  @type("number") timeWhenTimerIsOver: number = 0;
}
