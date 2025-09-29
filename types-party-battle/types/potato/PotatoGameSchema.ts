import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, mapGameStable } from "../GameSchema";

export const POTATO_DIRECTIONS = ["left", "right", "across"] as const;

export type PotatoDirection = (typeof POTATO_DIRECTIONS)[number];

export interface PotatoGame extends Game {
  playerWithPotato: string;
  remainingPlayers: string[];
  message: string;
}

export class PotatoGameSchema extends GameSchema {
  @type("string") playerWithPotato: string = "";
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") message: string = "";
}

export const mapPotatoGameStable = (
  game: PotatoGameSchema,
  prev?: PotatoGame
): PotatoGame => {
  const base = mapGameStable(game, prev);
  const playerWithPotato = game.playerWithPotato;
  const remainingPlayers = Array.from(game.remainingPlayers);
  const message = game.message;
  if (
    base === prev &&
    playerWithPotato === prev?.playerWithPotato &&
    remainingPlayers.length === prev?.remainingPlayers.length &&
    remainingPlayers.every((p, i) => p === prev?.remainingPlayers[i]) &&
    message === prev?.message
  ) {
    return prev!;
  }
  return { ...base, playerWithPotato, remainingPlayers, message };
};
