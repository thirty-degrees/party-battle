import { Schema, type } from "@colyseus/schema";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export class RGBColorSchema extends Schema {
  @type("number") r: number;
  @type("number") g: number;
  @type("number") b: number;

  constructor(r: number, g: number, b: number) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

export const rgbColorToString = (color: RGBColor): string => {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

export const rgbColorEquals = (a: RGBColor, b: RGBColor): boolean => {
  return a.r === b.r && a.g === b.g && a.b === b.b;
};

export const toRgbColor = (schema: RGBColorSchema): RGBColor => {
  return { r: schema.r, g: schema.g, b: schema.b };
};

export const fromRgbColor = (color: RGBColor): RGBColorSchema => {
  return new RGBColorSchema(color.r, color.g, color.b);
};

export const mapRgbColorStable = (
  schema: RGBColorSchema,
  prev?: RGBColor
): RGBColor =>
  prev && prev.r === schema.r && prev.g === schema.g && prev.b === schema.b
    ? prev
    : { r: schema.r, g: schema.g, b: schema.b };
