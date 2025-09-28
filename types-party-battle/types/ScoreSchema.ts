import { ArraySchema, Schema, type } from "@colyseus/schema";

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

export const mapScoresStable = (
  arr: ArraySchema<ScoreSchema>,
  prev?: Score[]
): Score[] => {
  const len = arr.length;
  const prevArr = prev ?? [];
  let changed = prevArr.length !== len;
  let next = changed ? Array<Score>(len) : prevArr;
  for (let i = 0; i < len; i++) {
    const item = mapScoreStable(arr[i], prevArr[i]);
    if (!changed && item !== prevArr[i]) {
      changed = true;
      next = prevArr.slice(0, i);
      next[i] = item;
    } else if (changed) {
      next[i] = item;
    }
  }
  return changed ? next : prevArr;
};
