import { MapSchema, Schema, type } from "@colyseus/schema";
import { GameType } from "./Game";
import { KeyValuePair } from "./Common";
import { GameHistory } from "./GameHistory";

export class Player extends Schema {
  @type("string") name: string = "";
}

export class Lobby extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") currentGame?: "croc" | null = null;
  @type("string") currentGameRoomId?: string | null = null;
  @type([{ map: GameHistory }]) gameHistory: Array<GameHistory> = [];
}
