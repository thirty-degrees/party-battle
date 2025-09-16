import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "./GameSchema";

export class SnakeGameSchema extends GameSchema {
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
}
