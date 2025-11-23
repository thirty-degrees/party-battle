import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapSimonSaysGameStable,
  SimonSaysGame,
  SimonSaysGameSchema,
} from 'types-party-battle/types/simon-says/SimonSaysGameSchema'

const initialSimonSaysGame: SimonSaysGame = {
  remainingPlayers: [],
  side: null,
  isFinalSide: false,
  timeWhenDecisionWindowEnds: 0,
  playersWhoPressed: [],
  players: [],
  status: 'waiting',
}

export const useSimonSaysGameStore = createColyseusRoomStore<SimonSaysGame, SimonSaysGameSchema>({
  initialView: initialSimonSaysGame,
  mapStable: (schema, prev) => mapSimonSaysGameStable(schema, prev),
  roomName: 'simon_says_game_room',
})
