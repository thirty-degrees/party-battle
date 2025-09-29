import { ArraySchema, type } from "@colyseus/schema";
import { GameSchema } from "../GameSchema";
import { RGBColorSchema } from "../RGBColorSchema";
import { ColorSchema } from "./ColorSchema";

export type selectionType = "color" | "word";

export class ColorReactionGameSchema extends GameSchema {
  @type("string") selectiontype?: selectionType;
  @type(ColorSchema) currentSelection?: ColorSchema;
  @type("string") guesserName?: string;
  @type("boolean") correctGuess?: boolean;
  @type("number") currentCountdownNumber?: number;
  @type([RGBColorSchema]) colorIdButtons = new ArraySchema<RGBColorSchema>();
}
