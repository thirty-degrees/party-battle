import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Direction } from "../snake/DirectionSchema";
import { Game, GameSchema, GameStatus, mapGameStable } from "../GameSchema";
import { mapArrayStable } from "../mapArrayStable";

export const SPACE_INVADERS_TICK_MS = 50;
export const SHIP_MAX_SPEED = 4;
export const SHIP_ACCEL_PER_TICK = 0.5;
export const SHIP_FRICTION_PER_TICK = 0.3;
export const BULLET_SPEED = 8;
export const BULLET_GRACE_MS = 150;
export const FIRE_COOLDOWN_MS = 2000;

export class ShipSchema extends Schema {
  @type("string") name: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") vx: number = 0;
  @type("number") vy: number = 0;
  @type("string") heading: Direction = "up";
  @type("boolean") gas: boolean = false;
  @type("number") lastFiredAtMs: number = 0;
}

export class BulletSchema extends Schema {
  @type("string") owner: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") dx: number = 0;
  @type("number") dy: number = 0;
  @type("number") createdAtMs: number = 0;
}

export interface SpaceInvadersGame extends Game {
  tick: number;
  width: number;
  height: number;
  remainingPlayers: string[];
  ships: ShipSchema[];
  bullets: BulletSchema[];
}

export class SpaceInvadersGameSchema extends GameSchema {
  @type("number") tick: number = 0;
  @type(["string"]) remainingPlayers = new ArraySchema<string>();
  @type("number") width: number;
  @type("number") height: number;
  @type([ShipSchema]) ships = new ArraySchema<ShipSchema>();
  @type([BulletSchema]) bullets = new ArraySchema<BulletSchema>();
  constructor(status: GameStatus, width: number, height: number) {
    super(status);
    this.width = width;
    this.height = height;
  }
}

export const mapSpaceInvadersGameStable = (schema: SpaceInvadersGameSchema, prev?: SpaceInvadersGame): SpaceInvadersGame => {
  const base = mapGameStable(schema, prev);
  const tick = schema.tick;
  const remainingPlayers = Array.from(schema.remainingPlayers);
  const width = schema.width;
  const height = schema.height;
  const ships = mapArrayStable(schema.ships, prev?.ships, (ship) => ship);
  const bullets = mapArrayStable(schema.bullets, prev?.bullets, (bullet) => bullet);
  if (
    prev &&
    base === prev &&
    tick === prev.tick &&
    width === prev.width &&
    height === prev.height &&
    remainingPlayers.length === prev.remainingPlayers.length &&
    remainingPlayers.every((p, i) => p === prev.remainingPlayers[i]) &&
    ships === prev.ships &&
    bullets === prev.bullets
  )
    return prev;
  return { ...base, tick, width, height, remainingPlayers, ships, bullets };
};
