import { Schema, type } from "@colyseus/schema";

export enum CellKind {
  Empty = 0,
  Snake = 1,
  Collectible = 2,
}

export class Cell extends Schema {
  @type("uint8") kind: CellKind;
  @type("string") player?: string;

  constructor(kind: CellKind) {
    super();
    this.kind = kind;
  }
}
