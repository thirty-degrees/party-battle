import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema, GameStatus } from "../GameSchema";
import { Cell } from "./Cell";

export class SnakeGameSchema extends GameSchema {
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("number") width;
  @type("number") height;
  @type([Cell]) board;

  constructor(
    status: GameStatus,
    width: number,
    height: number,
    board: ArraySchema<Cell>
  ) {
    super(status);
    this.width = width;
    this.height = height;
    this.board = board;
  }
}
