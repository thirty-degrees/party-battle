import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  mapPickCardsGameStable,
  PickCardsGame,
  PickCardsGameSchema,
} from 'types-party-battle/types/pick-cards/PickCardsGameSchema'

const initialPickCardsGame: PickCardsGame = {
  cardCount: 0,
  pressedCardIndex: [],
  remainingPlayers: [],
  currentPlayer: '',
  timeWhenTimerIsOver: 0,
  players: [],
  status: 'waiting',
}

export const usePickCardsGameStore = createColyseusRoomStore<PickCardsGame, PickCardsGameSchema>({
  initialView: initialPickCardsGame,
  mapStable: (schema, prev) => mapPickCardsGameStable(schema, prev),
  roomName: 'pickcards_game_room',
})
