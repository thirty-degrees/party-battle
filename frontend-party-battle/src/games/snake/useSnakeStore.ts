import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapSnakeGameStable,
  SNAKE_TICK_MS,
  SnakeGame,
  SnakeGameSchema,
} from 'types-party-battle/types/snake/SnakeGameSchema'

const initialSnakeGame: SnakeGame = {
  tick: 0,
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
  getTick: (schema) => schema.tick,
  bufferMs: 200,
  tickMs: SNAKE_TICK_MS,
})
