import { ArraySchema, Schema, type } from "@colyseus/schema";
import { GameSchema } from "../GameSchema";
import { RGBColorSchema } from "../RGBColorSchema";

export type selectionType = "color" | "word";

export class ColorSchema extends Schema {
  @type("string") word: string = "";
  @type("string") color: string = "";
}

export class ColorReactionGameSchema extends GameSchema {
  @type("string") selectiontype?: selectionType;
  @type(ColorSchema) currentSelection?: ColorSchema;
  @type("string") guesserName?: string;
  @type("boolean") correctGuess?: boolean;
  @type("number") currentCountdownNumber?: number;
  @type([RGBColorSchema]) colorIdButtons = new ArraySchema<RGBColorSchema>();
}
