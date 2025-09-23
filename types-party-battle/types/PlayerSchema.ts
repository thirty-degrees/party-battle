import { Schema, type } from "@colyseus/schema";
import { RGBColor, RGBColorSchema, fromRgbColor } from "./RGBColorSchema";

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
