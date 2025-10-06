import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, GameStatus, mapGameStable } from "../GameSchema";
import { mapArrayStable } from "../mapArrayStable";
import { Cell, CellSchema, mapCellStable } from "./CellSchema";

export const SNAKE_TICK_MS = 1000 / 3;
export interface SnakeGame extends Game {
  tick: number;
  remainingPlayers: string[];
  width: number;
  height: number;
  board: Cell[];
}

export class SnakeGameSchema extends GameSchema {
  @type("number") tick: number = 0;
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("number") width;
  @type("number") height;
  @type([CellSchema]) board;

  constructor(
    status: GameStatus,
    width: number,
    height: number,
    board: ArraySchema<CellSchema>
  ) {
    super(status);
    this.width = width;
    this.height = height;
    this.board = board;
  }
}

export const mapSnakeGameStable = (
  game: SnakeGameSchema,
  prev?: SnakeGame
): SnakeGame => {
  const base = mapGameStable(game, prev);
  const tick = game.tick;
  const remainingPlayers = Array.from(game.remainingPlayers);
  const width = game.width;
  const height = game.height;
  const board = mapArrayStable(game.board, prev?.board, mapCellStable);
  if (
    base === prev &&
    tick === prev?.tick &&
    remainingPlayers.length === prev?.remainingPlayers.length &&
    remainingPlayers.every((p, i) => p === prev?.remainingPlayers[i]) &&
    width === prev?.width &&
    height === prev?.height &&
    board === prev?.board
  ) {
    return prev!;
  }
  return { ...base, tick, remainingPlayers, width, height, board };
};
