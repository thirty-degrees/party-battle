import { Schema, type } from "@colyseus/schema";

export class ColorSchema extends Schema {
  @type("string") word: string = "";
  @type("string") color: string = "";
}
