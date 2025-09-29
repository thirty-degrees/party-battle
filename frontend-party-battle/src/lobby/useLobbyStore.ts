import type { Lobby, LobbySchema } from 'types-party-battle/types/LobbySchema'
import { mapLobbyStable } from 'types-party-battle/types/LobbySchema'
import { createColyseusRoomStore } from '../storage/colyseusRoomStore'

const initialLobby: Lobby = {
  players: {},
  currentGame: null,
  currentGameRoomId: null,
  gameHistories: [],
}

export const useLobbyStore = createColyseusRoomStore<Lobby, LobbySchema>({
  initialView: initialLobby,
  mapStable: (schema, prev) => mapLobbyStable(schema, prev),
  roomName: 'lobby_room',
})
