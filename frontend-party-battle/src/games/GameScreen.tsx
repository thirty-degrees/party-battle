import { GameRoomProvider } from '@/src/colyseus/GameRoomProvider'
import { Room } from 'colyseus.js'
import { ReactElement } from 'react'
import { GameSchema } from 'types-party-battle'
import GameRoomJoiner from './GameRoomJoiner'

interface GameScreenProps<T> {
  GameComponent: (props: { gameRoom: Room<T> }) => ReactElement
}

export default function GameScreen<T extends GameSchema>({
  GameComponent,
}: GameScreenProps<T>) {
  return (
    <GameRoomProvider<T>>
      <GameRoomJoiner GameComponent={GameComponent} />
    </GameRoomProvider>
  )
}
