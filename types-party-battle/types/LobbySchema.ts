import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import {
  GameHistory,
  GameHistorySchema,
  mapGameHistoryStable,
} from "./GameHistorySchema";
import { GameType } from "./GameSchema";
import {
  LobbyPlayer,
  LobbyPlayerSchema,
  mapLobbyPlayerStable,
} from "./LobbyPlayerSchema";
import { mapArrayStable } from "./mapArrayStable";

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

export const mapPlayersStable = (
  players: MapSchema<LobbyPlayerSchema>,
  prev?: Record<string, LobbyPlayer>
): Record<string, LobbyPlayer> => {
  const prevObj = prev ?? {};
  let nextObj = prevObj;
  let changed = false;
  const seen = new Set<string>();
  players.forEach((p, id) => {
    seen.add(id);
    const mapped = mapLobbyPlayerStable(p, prevObj[id]);
    if (mapped !== prevObj[id]) {
      if (nextObj === prevObj) nextObj = { ...prevObj };
      nextObj[id] = mapped;
      changed = true;
    }
  });
  for (const id in prevObj) {
    if (!seen.has(id)) {
      if (nextObj === prevObj) nextObj = { ...prevObj };
      delete nextObj[id];
      changed = true;
    }
  }
  return changed ? nextObj : prevObj;
};

export const mapLobbyStable = (state: LobbySchema, prev?: Lobby): Lobby => {
  const players = mapPlayersStable(state.players, prev?.players);
  const currentGame = state.currentGame ?? null;
  const currentGameRoomId = state.currentGameRoomId ?? null;
  const gameHistories = mapArrayStable(
    state.gameHistories,
    prev?.gameHistories,
    mapGameHistoryStable
  );
  if (
    prev &&
    prev.players === players &&
    prev.currentGame === currentGame &&
    prev.currentGameRoomId === currentGameRoomId &&
    prev.gameHistories === gameHistories
  ) {
    return prev;
  }
  return { players, currentGame, currentGameRoomId, gameHistories };
};
