import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, mapGameStable } from "../GameSchema";
import { Score, ScoreSchema, mapScoreStable } from "../ScoreSchema";
import { mapArrayStable } from "../mapArrayStable";
import {
  TriviaQuestion,
  TriviaQuestionSchema,
  mapTriviaQuestionStable,
} from "./TriviaQuestionSchema";

export interface TriviaGame extends Game {
  currentQuestion?: TriviaQuestion;
  currentCountdownNumber?: number;
  playerScores?: Score[];
  answerTimeRemaining?: number;
  timeWhenTimerIsOver?: number;
  roundState: "answering" | "results";
  currentRound: number;
  totalRounds: number;
}

export class TriviaGameSchema extends GameSchema {
  @type(TriviaQuestionSchema) currentQuestion: TriviaQuestionSchema | null =
    null;
  @type("number") currentCountdownNumber: number | null = null;
  @type([ScoreSchema]) playerScores = new ArraySchema<ScoreSchema>();
  @type("number") answerTimeRemaining: number | null = null;
  @type("number") timeWhenTimerIsOver: number = 0;
  @type("string") roundState: "answering" | "results" = "answering";
  @type("number") currentRound: number = 0;
  @type("number") totalRounds: number = 5;
}

export const mapTriviaGameStable = (
  schema: TriviaGameSchema,
  prev?: TriviaGame
): TriviaGame => {
  const base = mapGameStable(schema, prev);
  const next: TriviaGame = {
    ...base,
    currentQuestion: mapTriviaQuestionStable(
      schema.currentQuestion,
      prev?.currentQuestion
    ),
    currentCountdownNumber: schema.currentCountdownNumber ?? undefined,
    playerScores: mapArrayStable(
      schema.playerScores,
      prev?.playerScores,
      mapScoreStable
    ),
    answerTimeRemaining: schema.answerTimeRemaining ?? undefined,
    timeWhenTimerIsOver: schema.timeWhenTimerIsOver,
    roundState: schema.roundState,
    currentRound: schema.currentRound,
    totalRounds: schema.totalRounds,
  };
  return next;
};
