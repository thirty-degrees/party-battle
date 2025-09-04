import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameType } from "./Game";
import { GameHistorySchema } from "./GameHistory";

export class Player extends Schema {
  @type("string") name: string = "";
}

export class LobbyPlayer extends Player {
  @type("boolean") ready: boolean = false;
}

export class LobbySchema extends Schema {
  @type({ map: LobbyPlayer }) players = new MapSchema<LobbyPlayer>();
  @type("string") currentGame?: GameType | null;
  @type("string") currentGameRoomId?: string | null;
  @type([GameHistorySchema]) gameHistories = new ArraySchema<GameHistorySchema>();
}
