import { Schema, type } from "@colyseus/schema";

export interface Score {
  playerName: string;
  value: number;
}

export class ScoreSchema extends Schema {
  @type("string") playerName: string;
  @type("number") value: number;

  constructor(playerName: string, value: number) {
    super();
    this.playerName = playerName;
    this.value = value;
  }
}

export const mapScoreStable = (s: ScoreSchema, prev?: Score): Score => {
  const playerName = s.playerName;
  const value = s.value;
  if (prev && prev.playerName === playerName && prev.value === value)
    return prev;
  return { playerName, value };
};
