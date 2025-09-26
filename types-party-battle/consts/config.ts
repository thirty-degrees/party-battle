import { RGBColor } from "../types/RGBColorSchema";

export const MAX_AMOUNT_OF_PLAYERS = 8;
export const PLAYER_NAME_MAX_LENGTH = 15;
export const PLAYER_COLORS: RGBColor[] = [
  { r: 229, g: 62, b: 62 }, // Red
  { r: 49, g: 130, b: 206 }, // Blue
  { r: 56, g: 161, b: 105 }, // Green
  { r: 221, g: 107, b: 32 }, // Orange
  { r: 214, g: 158, b: 46 }, // Yellow
  { r: 128, g: 90, b: 213 }, // Purple
  { r: 213, g: 63, b: 140 }, // Pink
  { r: 49, g: 151, b: 149 }, // Teal
] as const;

export const COLOR_NAME_TO_RGB = {
  red: { r: 229, g: 62, b: 62 },
  blue: { r: 49, g: 130, b: 206 },
  green: { r: 56, g: 161, b: 105 },
  orange: { r: 221, g: 107, b: 32 },
  yellow: { r: 214, g: 158, b: 46 },
  purple: { r: 128, g: 90, b: 213 },
  pink: { r: 213, g: 63, b: 140 },
  teal: { r: 49, g: 151, b: 149 },
} as const;
