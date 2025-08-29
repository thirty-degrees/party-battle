import { MapSchema, Schema, type } from "@colyseus/schema";
import { GameHistory } from "./GameHistory";

export class Player extends Schema {
  @type("string") name: string = "";
}

export class LobbyPlayer extends Player {
  @type("boolean") ready: boolean = false;
}

export class Lobby extends Schema {
  @type({ map: LobbyPlayer }) players = new MapSchema<LobbyPlayer>();
  @type("string") currentGame?: "croc" | null = null;
  @type("string") currentGameRoomId?: string | null = null;
  @type([{ map: GameHistory }]) gameHistory: Array<GameHistory> = [];
}
