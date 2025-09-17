import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameHistorySchema } from "./GameHistorySchema";
import { GameType } from "./GameSchema";
import { LobbyPlayerSchema } from "./LobbyPlayerSchema";

export class LobbySchema extends Schema {
  @type({ map: LobbyPlayerSchema }) players =
    new MapSchema<LobbyPlayerSchema>();
  @type("string") currentGame?: GameType | null;
  @type("string") currentGameRoomId?: string | null;
  @type([GameHistorySchema]) gameHistories =
    new ArraySchema<GameHistorySchema>();
}
