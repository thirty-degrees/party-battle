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
}

export const toCell = (cellSchema: CellSchema): Cell => {
  return {
    kind: cellSchema.kind,
    player: cellSchema.player,
  };
};

export const fromCell = (data: Cell): CellSchema => {
  const cell = new CellSchema(data.kind);
  if (data.player) {
    cell.player = data.player;
  }
  return cell;
};

export const mapCellStable = (schema: CellSchema, prev?: Cell): Cell => {
  const kind = schema.kind;
  const player = schema.player;
  if (prev && prev.kind === kind && prev.player === player) return prev;
  return { kind, player };
};
