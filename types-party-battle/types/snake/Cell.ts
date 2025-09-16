import { Schema, type } from "@colyseus/schema";

export enum CellKind {
  Empty = 0,
  Snake = 1,
  Collectible = 2,
}

export interface Cell {
  kind: CellKind;
  player?: string;
}

export class CellSchema extends Schema {
  @type("uint8") kind: CellKind;
  @type("string") player?: string;

  constructor(kind: CellKind) {
    super();
    this.kind = kind;
  }

  static fromCell(data: Cell): CellSchema {
    const cell = new CellSchema(data.kind);
    if (data.player) {
      cell.player = data.player;
    }
    return cell;
  }
}
