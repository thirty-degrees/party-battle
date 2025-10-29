import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapSpaceInvadersGameStable,
  SPACE_INVADERS_TICK_MS,
  SpaceInvadersGame,
  SpaceInvadersGameSchema,
} from 'types-party-battle/types/space-invaders/SpaceInvadersGameSchema'

const initialView: SpaceInvadersGame = {
  players: [],
  status: 'waiting',
  tick: 0,
  width: 0,
  height: 0,
  remainingPlayers: [],
  ships: [],
  bullets: [],
}

export const useSpaceInvadersStore = createColyseusRoomStore<SpaceInvadersGame, SpaceInvadersGameSchema>({
  initialView,
  mapStable: (schema, prev) => mapSpaceInvadersGameStable(schema, prev),
  roomName: 'space-invaders_game_room',
  getTick: (schema) => schema.tick,
  bufferMs: 200,
  tickMs: SPACE_INVADERS_TICK_MS,
})
