import { Schema, type } from "@colyseus/schema";

export interface Color {
  word: string;
  color: string;
}

export class ColorSchema extends Schema {
  @type("string") word: string;
  @type("string") color: string;

  constructor(word: string = "", color: string = "") {
    super();
    this.word = word;
    this.color = color;
  }
}

export const mapColorStable = (schema: ColorSchema, prev?: Color): Color => {
  const word = schema.word;
  const color = schema.color;
  if (prev && prev.word === word && prev.color === color) return prev;
  return { word, color };
};
