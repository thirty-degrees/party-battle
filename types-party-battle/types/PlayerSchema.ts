import { Schema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type("string") name: string;
  @type("string") color: string = "#000000";

  constructor(name: string) {
    super();
    this.name = name;
  }
}
