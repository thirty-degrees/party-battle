import { Schema, type } from "@colyseus/schema";

export const DIRECTIONS = ["up", "down", "left", "right"] as const;

export type Direction = (typeof DIRECTIONS)[number];

export interface RemainingPlayer {
  name: string;
  direction: Direction;
}

export class RemainingPlayerSchema extends Schema {
  @type("string") name: string;
  @type("string") direction: Direction;

  constructor(name: string, direction: Direction) {
    super();
    this.name = name;
    this.direction = direction;
  }
}

export const toRemainingPlayer = (
  remainingPlayerSchema: RemainingPlayerSchema
): RemainingPlayer => {
  return {
    name: remainingPlayerSchema.name,
    direction: remainingPlayerSchema.direction,
  };
};

export const fromRemainingPlayer = (
  data: RemainingPlayer
): RemainingPlayerSchema => {
  return new RemainingPlayerSchema(data.name, data.direction);
};

export const mapRemainingPlayerStable = (
  schema: RemainingPlayerSchema,
  prev?: RemainingPlayer
): RemainingPlayer => {
  const name = schema.name;
  const direction = schema.direction;
  if (prev && prev.name === name && prev.direction === direction) return prev;
  return { name, direction };
};
