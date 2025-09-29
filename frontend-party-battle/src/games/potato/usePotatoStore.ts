import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapPotatoGameStable,
  PotatoGame,
  PotatoGameSchema,
} from 'types-party-battle/types/potato/PotatoGameSchema'

const initialPotatoGame: PotatoGame = {
  playerWithPotato: '',
  remainingPlayers: [],
  message: '',
  players: [],
  status: 'waiting',
}

export const usePotatoGameStore = createColyseusRoomStore<PotatoGame, PotatoGameSchema>({
  initialView: initialPotatoGame,
  mapStable: (schema, prev) => mapPotatoGameStable(schema, prev),
  roomName: 'potato_game_room',
})
