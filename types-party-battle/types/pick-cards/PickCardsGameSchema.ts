import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, mapGameStable } from "../GameSchema";

export interface PickCardsGame extends Game {
  cardCount: number;
  pressedCardIndex: number[];
  remainingPlayers: string[];
  currentPlayer: string;
  timeWhenTimerIsOver: number;
}

export class PickCardsGameSchema extends GameSchema {
  @type("number") cardCount: number = 0;
  @type(["number"]) pressedCardIndex = new ArraySchema<number>();
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") currentPlayer: string = "";
  @type("number") timeWhenTimerIsOver: number = 0;
}

export const mapPickCardsGameStable = (
  game: PickCardsGameSchema,
  prev?: PickCardsGame
): PickCardsGame => {
  const base = mapGameStable(game, prev);
  const cardCount = game.cardCount;
  const pressedCardIndex = Array.from(game.pressedCardIndex);
  const remainingPlayers = Array.from(game.remainingPlayers);
  const currentPlayer = game.currentPlayer;
  const timeWhenTimerIsOver = game.timeWhenTimerIsOver;
  if (
    base === prev &&
    cardCount === prev?.cardCount &&
    pressedCardIndex.length === prev?.pressedCardIndex.length &&
    pressedCardIndex.every((p, i) => p === prev?.pressedCardIndex[i]) &&
    remainingPlayers.length === prev?.remainingPlayers.length &&
    remainingPlayers.every((p, i) => p === prev?.remainingPlayers[i]) &&
    currentPlayer === prev?.currentPlayer &&
    timeWhenTimerIsOver === prev?.timeWhenTimerIsOver
  ) {
    return prev!;
  }
  return {
    ...base,
    cardCount,
    pressedCardIndex,
    remainingPlayers,
    currentPlayer,
    timeWhenTimerIsOver,
  };
};
