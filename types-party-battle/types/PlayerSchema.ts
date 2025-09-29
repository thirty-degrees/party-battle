import { Schema, type } from "@colyseus/schema";
import {
  RGBColor,
  RGBColorSchema,
  fromRgbColor,
  mapRgbColorStable,
} from "./RGBColorSchema";

export interface Player {
  name: string;
  color: RGBColor;
}

export class PlayerSchema extends Schema {
  @type("string") name: string;
  @type(RGBColorSchema) color: RGBColorSchema;

  constructor(name: string, color: RGBColor) {
    super();
    this.name = name;
    this.color = fromRgbColor(color);
  }
}

export const mapPlayerStable = (p: PlayerSchema, prev?: Player): Player => {
  const name = p.name;
  const color = mapRgbColorStable(p.color, prev?.color);
  if (prev && prev.name === name && prev.color === color) return prev;
  return { name, color };
};
