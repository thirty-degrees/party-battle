import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, mapGameStable } from "../GameSchema";

export type SimonSide = "left" | "right";

export interface SimonSaysGame extends Game {
  remainingPlayers: string[];
  side?: SimonSide | null;
  isFinalSide: boolean;
  timeWhenDecisionWindowEnds: number;
  playersWhoPressed: string[];
}

export class SimonSaysGameSchema extends GameSchema {
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") side?: SimonSide | null;
  @type("boolean") isFinalSide: boolean = false;
  @type("number") timeWhenDecisionWindowEnds: number = 0;
  @type(["string"]) playersWhoPressed = new ArraySchema<string>();
}

export const mapSimonSaysGameStable = (
  game: SimonSaysGameSchema,
  prev?: SimonSaysGame
): SimonSaysGame => {
  const base = mapGameStable(game, prev);
  const remainingPlayers = Array.from(game.remainingPlayers);
  const side = game.side;
  const isFinalSide = game.isFinalSide;
  const timeWhenDecisionWindowEnds = game.timeWhenDecisionWindowEnds;
  const playersWhoPressed = Array.from(game.playersWhoPressed);
  if (
    base === prev &&
    remainingPlayers.length === prev?.remainingPlayers.length &&
    remainingPlayers.every((p, i) => p === prev?.remainingPlayers[i]) &&
    side === prev?.side &&
    isFinalSide === prev?.isFinalSide &&
    timeWhenDecisionWindowEnds === prev?.timeWhenDecisionWindowEnds &&
    playersWhoPressed.length === prev?.playersWhoPressed.length &&
    playersWhoPressed.every((p, i) => p === prev?.playersWhoPressed[i])
  ) {
    return prev!;
  }
  return {
    ...base,
    remainingPlayers,
    side,
    isFinalSide,
    timeWhenDecisionWindowEnds,
    playersWhoPressed,
  };
};

