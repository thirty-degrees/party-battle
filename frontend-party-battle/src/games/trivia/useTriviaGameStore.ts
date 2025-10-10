import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  TriviaGame,
  TriviaGameSchema,
  mapTriviaGameStable,
} from 'types-party-battle/types/trivia/TriviaGameSchema'

const initialTriviaGame: TriviaGame = {
  currentQuestion: undefined,
  currentCountdownNumber: undefined,
  playerScores: undefined,
  answerTimeRemaining: undefined,
  timeWhenTimerIsOver: 0,
  players: [],
  status: 'waiting',
  roundState: 'answering',
}

export const useTriviaGameStore = createColyseusRoomStore<TriviaGame, TriviaGameSchema>({
  initialView: initialTriviaGame,
  mapStable: (schema, prev) => mapTriviaGameStable(schema, prev),
  roomName: 'trivia_game_room',
})
