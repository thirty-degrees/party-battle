import { GameRoomProvider } from '@/src/colyseus/GameRoomProvider'
import { GameSchema } from 'types-party-battle'
import { GameComponent } from './GameComponent'
import GameRoomJoiner from './GameRoomJoiner'

interface GameScreenProps<T extends GameSchema> {
  GameComponent: GameComponent<T>
}

export default function GameScreen<T extends GameSchema>({ GameComponent }: GameScreenProps<T>) {
  return (
    <GameRoomProvider<T>>
      <GameRoomJoiner GameComponent={GameComponent} />
    </GameRoomProvider>
  )
}
