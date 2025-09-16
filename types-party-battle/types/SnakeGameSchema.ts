import { ArraySchema, type } from "@colyseus/schema";
import { Cell } from "./Cell";
import { GameSchema } from "./GameSchema";

export class SnakeGameSchema extends GameSchema {
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("number") width = 0;
  @type("number") height = 0;
  @type([Cell]) board = new ArraySchema<Cell>();
}
