import GameScreen from '@/src/games/GameScreen'
import { PickCardsGame } from '@/src/games/pick-cards/PickCardsGame'
import { PickCardsGameSchema } from 'types-party-battle/types/pick-cards/PickCardsGameSchema'

export default function PickCardsScreen() {
  return <GameScreen<PickCardsGameSchema> GameComponent={PickCardsGame} />
}
