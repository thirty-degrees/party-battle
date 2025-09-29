import { createColyseusRoomStore } from '@/src/storage/colyseusRoomStore'
import {
  ColorReactionGame,
  ColorReactionGameSchema,
  mapColorReactionGameStable,
} from 'types-party-battle/types/color-reaction/ColorReactionGameSchema'

const initialColorReactionGame: ColorReactionGame = {
  selectiontype: undefined,
  currentSelection: undefined,
  guesserName: undefined,
  correctGuess: undefined,
  currentCountdownNumber: undefined,
  colorIdButtons: [],
  players: [],
  status: 'waiting',
}

export const useColorReactionGameStore = createColyseusRoomStore<ColorReactionGame, ColorReactionGameSchema>({
  initialView: initialColorReactionGame,
  mapStable: (schema, prev) => mapColorReactionGameStable(schema, prev),
  roomName: 'color_reaction_game_room',
})
