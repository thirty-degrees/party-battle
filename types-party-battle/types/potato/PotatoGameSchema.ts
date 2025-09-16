import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "../GameSchema";

export const POTATO_DIRECTIONS = ["left", "right", "across"] as const;

export type PotatoDirection = (typeof POTATO_DIRECTIONS)[number];

export class PotatoGameSchema extends GameSchema {
  @type("string") playerWithPotato: string = "";
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("string") message: string = "";
}
