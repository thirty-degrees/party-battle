import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapSnakeGameStable,
  SnakeGame,
  SnakeGameSchema,
} from 'types-party-battle/types/snake/SnakeGameSchema'

const initialSnakeGame: SnakeGame = {
  remainingPlayers: [],
  width: 0,
  height: 0,
  board: [],
  players: [],
  status: 'waiting',
}

export const useSnakeGameStore = createColyseusRoomStore<SnakeGame, SnakeGameSchema>({
  initialView: initialSnakeGame,
  mapStable: (schema, prev) => mapSnakeGameStable(schema, prev),
  roomName: 'snake_game_room',
})
