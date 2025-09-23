import { type } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";
import { RGBColor } from "./RGBColorSchema";

export interface LobbyPlayer {
  name: string;
  ready: boolean;
  color: RGBColor;
}

export class LobbyPlayerSchema extends PlayerSchema {
  @type("boolean") ready: boolean;

  constructor(name: string, color: RGBColor, ready: boolean) {
    super(name, color);
    this.ready = ready;
  }
}
