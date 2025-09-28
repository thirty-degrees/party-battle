import { type } from "@colyseus/schema";
import { Player, PlayerSchema } from "./PlayerSchema";
import { RGBColor, mapRgbColorStable } from "./RGBColorSchema";

export interface LobbyPlayer extends Player {
  ready: boolean;
}

export class LobbyPlayerSchema extends PlayerSchema {
  @type("boolean") ready: boolean;

  constructor(name: string, color: RGBColor, ready: boolean) {
    super(name, color);
    this.ready = ready;
  }
}

export const mapLobbyPlayerStable = (
  p: LobbyPlayerSchema,
  prev?: LobbyPlayer
): LobbyPlayer => {
  const name = p.name;
  const ready = p.ready;
  const color = mapRgbColorStable(p.color, prev?.color);
  if (
    prev &&
    prev.name === name &&
    prev.ready === ready &&
    prev.color === color
  )
    return prev;
  return { name, color, ready };
};
