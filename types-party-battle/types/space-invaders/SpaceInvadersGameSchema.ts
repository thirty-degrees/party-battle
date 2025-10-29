import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Game, GameSchema, GameStatus, mapGameStable } from "../GameSchema";
import { mapArrayStable } from "../mapArrayStable";
import { Direction } from "../snake/DirectionSchema";

export const SPACE_INVADERS_TICK_MS = 50;
export const SHIP_MAX_SPEED = 4;
export const SHIP_ACCEL_PER_TICK = 0.5;
export const SHIP_FRICTION_PER_TICK = 0.3;
export const BULLET_SPEED = 8;
export const BULLET_GRACE_MS = 150;
export const FIRE_COOLDOWN_MS = 1000;

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

export interface Ship {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: Direction;
  gas: boolean;
  lastFiredAtMs: number;
}

export interface Bullet {
  owner: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  createdAtMs: number;
}

export interface SpaceInvadersGame extends Game {
  tick: number;
  width: number;
  height: number;
  remainingPlayers: string[];
  ships: Ship[];
  bullets: Bullet[];
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

export const mapSpaceInvadersGameStable = (
  schema: SpaceInvadersGameSchema,
  prev?: SpaceInvadersGame
): SpaceInvadersGame => {
  const base = mapGameStable(schema, prev);
  const tick = schema.tick;
  const remainingPlayers = Array.from(schema.remainingPlayers);
  const width = schema.width;
  const height = schema.height;
  const ships = mapArrayStable(schema.ships, prev?.ships, mapShipStable);
  const bullets = mapArrayStable(schema.bullets, prev?.bullets, mapBulletStable);
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

export const mapShipStable = (schema: ShipSchema, prev?: Ship): Ship => {
  const name = schema.name;
  const x = schema.x;
  const y = schema.y;
  const vx = schema.vx;
  const vy = schema.vy;
  const heading = schema.heading;
  const gas = schema.gas;
  const lastFiredAtMs = schema.lastFiredAtMs;
  if (
    prev &&
    prev.name === name &&
    prev.x === x &&
    prev.y === y &&
    prev.vx === vx &&
    prev.vy === vy &&
    prev.heading === heading &&
    prev.gas === gas &&
    prev.lastFiredAtMs === lastFiredAtMs
  )
    return prev;
  return { name, x, y, vx, vy, heading, gas, lastFiredAtMs };
};

export const mapBulletStable = (schema: BulletSchema, prev?: Bullet): Bullet => {
  const owner = schema.owner;
  const x = schema.x;
  const y = schema.y;
  const dx = schema.dx;
  const dy = schema.dy;
  const createdAtMs = schema.createdAtMs;
  if (
    prev &&
    prev.owner === owner &&
    prev.x === x &&
    prev.y === y &&
    prev.dx === dx &&
    prev.dy === dy &&
    prev.createdAtMs === createdAtMs
  )
    return prev;
  return { owner, x, y, dx, dy, createdAtMs };
};


