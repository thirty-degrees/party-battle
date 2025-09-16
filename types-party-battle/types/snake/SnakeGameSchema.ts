import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "../GameSchema";
import { Cell } from "./Cell";

export class SnakeGameSchema extends GameSchema {
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("number") width = 0;
  @type("number") height = 0;
  @type([Cell]) board = new ArraySchema<Cell>();
}
