import { Schema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type("string") name: string;
  @type("string") color: string;

  constructor(name: string, color: string) {
    super();
    this.name = name;
    this.color = color;
  }
}
