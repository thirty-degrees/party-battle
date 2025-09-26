import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameHistory, GameHistorySchema } from "./GameHistorySchema";
import { GameType } from "./GameSchema";
import { LobbyPlayer, LobbyPlayerSchema } from "./LobbyPlayerSchema";

export interface Lobby {
  players: { [sessionId: string]: LobbyPlayer };
  currentGame?: GameType | null;
  currentGameRoomId?: string | null;
  gameHistories: GameHistory[];
}

export class LobbySchema extends Schema {
  @type({ map: LobbyPlayerSchema }) players =
    new MapSchema<LobbyPlayerSchema>();
  @type("string") currentGame?: GameType | null;
  @type("string") currentGameRoomId?: string | null;
  @type([GameHistorySchema]) gameHistories =
    new ArraySchema<GameHistorySchema>();
}
