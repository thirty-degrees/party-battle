import { ArraySchema, type } from "@colyseus/schema";
import { Game, GameSchema, mapGameStable } from "../GameSchema";
import { mapArrayStable } from "../mapArrayStable";
import { RGBColor, RGBColorSchema, mapRgbColorStable } from "../RGBColorSchema";
import { Color, ColorSchema, mapColorStable } from "./ColorSchema";

export type selectionType = "color" | "word";

export interface ColorReactionGame extends Game {
  selectiontype?: selectionType;
  currentSelection?: Color;
  guesserName?: string;
  correctGuess?: boolean;
  currentCountdownNumber?: number;
  colorIdButtons: RGBColor[];
}

export class ColorReactionGameSchema extends GameSchema {
  @type("string") selectiontype?: selectionType;
  @type(ColorSchema) currentSelection?: ColorSchema;
  @type("string") guesserName?: string;
  @type("boolean") correctGuess?: boolean;
  @type("number") currentCountdownNumber?: number;
  @type([RGBColorSchema]) colorIdButtons = new ArraySchema<RGBColorSchema>();
}

export const mapColorReactionGameStable = (
  game: ColorReactionGameSchema,
  prev?: ColorReactionGame
): ColorReactionGame => {
  const base = mapGameStable(game, prev);
  const selectiontype = game.selectiontype;
  const currentSelection = game.currentSelection
    ? mapColorStable(game.currentSelection, prev?.currentSelection)
    : undefined;
  const guesserName = game.guesserName;
  const correctGuess = game.correctGuess;
  const currentCountdownNumber = game.currentCountdownNumber;
  const colorIdButtons = mapArrayStable(
    game.colorIdButtons,
    prev?.colorIdButtons,
    mapRgbColorStable
  );
  if (
    base === prev &&
    selectiontype === prev?.selectiontype &&
    currentSelection === prev?.currentSelection &&
    guesserName === prev?.guesserName &&
    correctGuess === prev?.correctGuess &&
    currentCountdownNumber === prev?.currentCountdownNumber &&
    colorIdButtons === prev?.colorIdButtons
  ) {
    return prev!;
  }
  return {
    ...base,
    selectiontype,
    currentSelection,
    guesserName,
    correctGuess,
    currentCountdownNumber,
    colorIdButtons,
  };
};
