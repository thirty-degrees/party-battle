import GameScreen from '@/src/games/GameScreen'
import { PotatoGame } from '@/src/games/potato/PotatoGame'
import { PotatoGameSchema } from 'types-party-battle/types/PotatoGameSchema'

export default function PotatoScreen() {
  return <GameScreen<PotatoGameSchema> GameComponent={PotatoGame} />
}
