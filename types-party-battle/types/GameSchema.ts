import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Player, PlayerSchema, mapPlayerStable } from "./PlayerSchema";
import { mapArrayStable } from "./mapArrayStable";

export const GAME_TYPES = [
  "pick-cards",
  "snake",
  "potato",
  "color-reaction",
  "trivia",
  "space-invaders",
] as const;

export type GameType = (typeof GAME_TYPES)[number];

export type GameStatus = "waiting" | "playing" | "paused" | "finished";

export interface Game {
  players: Player[];
  status: GameStatus;
}

export abstract class GameSchema extends Schema {
  @type([PlayerSchema]) players = new ArraySchema<PlayerSchema>();
  @type("string") status: GameStatus;

  constructor(status: GameStatus) {
    super();
    this.status = status;
  }
}

export const mapGameStable = (game: GameSchema, prev?: Game): Game => {
  const players = mapArrayStable(game.players, prev?.players, mapPlayerStable);
  const status = game.status;
  if (prev && prev.players === players && prev.status === status) return prev;
  return { players, status };
};
