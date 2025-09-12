import GameScreen from '@/src/games/GameScreen'
import { PickCardsGame } from '@/src/games/croc/PickCardsGame'
import { PickCardsGameSchema } from 'types-party-battle'

export default function PickCardsScreen() {
  return <GameScreen<PickCardsGameSchema> GameComponent={PickCardsGame} />
}
