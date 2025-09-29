import { RGBColor } from "../types/RGBColorSchema";

export const MAX_AMOUNT_OF_PLAYERS = 8;
export const PLAYER_NAME_MAX_LENGTH = 15;
const color = (r: number, g: number, b: number): RGBColor => ({ r, g, b });

export const COLOR_NAME_TO_RGB = {
  red: color(229, 62, 62),
  blue: color(49, 130, 206),
  green: color(56, 161, 105),
  orange: color(221, 107, 32),
  darkgreen: color(0, 100, 0),
  lightgreen: color(144, 238, 144),
  purple: color(128, 90, 213),
  pink: color(213, 63, 140),
  cyan: color(34, 211, 238),
} as const;

export type ColorName = keyof typeof COLOR_NAME_TO_RGB;

export const PLAYER_COLORS: readonly RGBColor[] = Object.freeze(
  Object.values(COLOR_NAME_TO_RGB)
);
