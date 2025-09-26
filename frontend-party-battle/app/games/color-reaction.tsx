import { ColorReactionGame } from '@/src/games/color-reaction/ColorReactionGame'
import GameScreen from '@/src/games/GameScreen'
import { ColorReactionGameSchema } from 'types-party-battle/types/color-reaction/ColorReactionGameSchema'
export default function ColorReactionScreen() {
  return <GameScreen<ColorReactionGameSchema> GameComponent={ColorReactionGame} />
}
