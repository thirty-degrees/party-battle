import { Schema, type } from "@colyseus/schema";

export class Cell extends Schema {
  @type("uint8") kind: number = 0;
  @type("string") playerId?: string;
}
