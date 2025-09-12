import Loading from '@/components/loading'
import { useGameRoomContext } from '@/src/colyseus/GameRoomProvider'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { GameSchema } from 'types-party-battle'
import { GameComponent } from './GameComponent'
import GameRoomLeaver from './GameRoomLeaver'

interface GameRoomJoinerProps<T extends GameSchema> {
  GameComponent: GameComponent<T>
}

export default function GameRoomJoiner<T extends GameSchema>({ GameComponent }: GameRoomJoinerProps<T>) {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const { gameRoom, isLoading, joinGameRoom } = useGameRoomContext<T>()

  useEffect(() => {
    if (roomId && !isLoading && !gameRoom) {
      joinGameRoom(roomId)
    }
  }, [roomId, joinGameRoom, isLoading, gameRoom])

  if (isLoading || !gameRoom) {
    return <Loading />
  }

  return <GameRoomLeaver GameComponent={GameComponent} gameRoom={gameRoom} />
}
