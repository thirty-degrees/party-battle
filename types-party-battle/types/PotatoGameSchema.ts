import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "./GameSchema";

export type PotatoDirection = "left" | "right" | "across";

export class PotatoGameSchema extends GameSchema {
  @type("string") playerWithPotato: string = "";
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") message: string = "";
}
