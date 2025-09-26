import { type } from "@colyseus/schema";
import { Player, PlayerSchema } from "./PlayerSchema";
import { RGBColor } from "./RGBColorSchema";

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
