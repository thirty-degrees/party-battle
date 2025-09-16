import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema, GameStatus } from "../GameSchema";
import { CellSchema } from "./CellSchema";

export class SnakeGameSchema extends GameSchema {
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
