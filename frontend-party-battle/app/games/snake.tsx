import GameScreen from '@/src/games/GameScreen'
import SnakeGame from '@/src/games/snake/SnakeGame'
import { SnakeGameSchema } from 'types-party-battle'

export default function SnakeScreen() {
  return <GameScreen<SnakeGameSchema> GameComponent={SnakeGame} />
}
