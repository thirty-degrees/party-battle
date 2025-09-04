import { Schema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type("string") name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
