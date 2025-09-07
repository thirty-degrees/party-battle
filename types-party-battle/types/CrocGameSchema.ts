import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "./GameSchema";

export class CrocGameSchema extends GameSchema {
  @type("number") teethCount: number = 0;
  @type(["number"]) pressedTeethIndex = new ArraySchema<number>();
}
