import { ArraySchema, Schema, type } from "@colyseus/schema";

export interface TriviaQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

export class TriviaQuestionSchema extends Schema {
  @type("string") question: string = "";
  @type("string") correctAnswer: string = "";
  @type(["string"]) incorrectAnswers = new ArraySchema<string>();
}

export const mapTriviaQuestionStable = (
  schema: TriviaQuestionSchema | null,
  prev?: TriviaQuestion
): TriviaQuestion | undefined => {
  if (!schema) return undefined;
  const next: TriviaQuestion = {
    question: schema.question,
    correctAnswer: schema.correctAnswer,
    incorrectAnswers: Array.from(schema.incorrectAnswers),
  };
  if (
    prev &&
    prev.question === next.question &&
    prev.correctAnswer === next.correctAnswer &&
    prev.incorrectAnswers.length === next.incorrectAnswers.length &&
    prev.incorrectAnswers.every((v, i) => v === next.incorrectAnswers[i])
  ) {
    return prev;
  }
  return next;
};
