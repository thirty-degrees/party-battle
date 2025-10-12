import { ArraySchema, Schema, type } from "@colyseus/schema";

export interface TriviaQuestion {
  question: string;
  allAnswers: string[];
  correctAnswerIndex: number;
}

export class TriviaQuestionSchema extends Schema {
  @type("string") question: string = "";
  @type(["string"]) allAnswers = new ArraySchema<string>();
  @type("number") correctAnswerIndex: number = 0;
}

export const mapTriviaQuestionStable = (
  schema: TriviaQuestionSchema | null,
  prev?: TriviaQuestion
): TriviaQuestion | undefined => {
  if (!schema) return undefined;
  const next: TriviaQuestion = {
    question: schema.question,
    allAnswers: Array.from(schema.allAnswers),
    correctAnswerIndex: schema.correctAnswerIndex,
  };
  if (
    prev &&
    prev.question === next.question &&
    prev.allAnswers.length === next.allAnswers.length &&
    prev.allAnswers.every((v, i) => v === next.allAnswers[i]) &&
    prev.correctAnswerIndex === next.correctAnswerIndex
  ) {
    return prev;
  }
  return next;
};
