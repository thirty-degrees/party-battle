import { Schema, type } from "@colyseus/schema";

export enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

export interface RemainingPlayer {
  name: string;
  direction: Direction;
}

export class RemainingPlayerSchema extends Schema {
  @type("string") name: string;
  @type("uint8") direction: Direction;

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
