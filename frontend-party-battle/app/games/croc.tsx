import GameScreen from '@/src/games/GameScreen'
import { CrocGame } from '@/src/games/croc/CrocGame'
import { CrocGameSchema } from 'types-party-battle'

export default function CrocScreen() {
  return <GameScreen<CrocGameSchema> GameComponent={CrocGame} />
}
