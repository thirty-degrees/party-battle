import { Schema, type } from "@colyseus/schema";

export const DIRECTIONS = ["up", "down", "left", "right"] as const;

export type Direction = (typeof DIRECTIONS)[number];

export interface RemainingPlayer {
  name: string;
}

export class RemainingPlayerSchema extends Schema {
  @type("string") name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export const toRemainingPlayer = (
  remainingPlayerSchema: RemainingPlayerSchema
): RemainingPlayer => {
  return {
    name: remainingPlayerSchema.name,
  };
};

export const fromRemainingPlayer = (
  data: RemainingPlayer
): RemainingPlayerSchema => {
  return new RemainingPlayerSchema(data.name);
};

export const mapRemainingPlayerStable = (
  schema: RemainingPlayerSchema,
  prev?: RemainingPlayer
): RemainingPlayer => {
  const name = schema.name;
  if (prev && prev.name === name) return prev;
  return { name };
};
