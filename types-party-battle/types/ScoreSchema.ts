import { Schema, type } from "@colyseus/schema";

export interface Score {
  playerName: string;
  value: number;
}

export class ScoreSchema extends Schema
{
  @type("string") playerName!: string;
  @type("number") value!: number;
}
