import Loading from '@/components/Loading'
import {
  GameRoomProvider,
  useGameRoomContext,
} from '@/src/colyseus/GameRoomProvider'
import CrocGameContent from '@/src/games/CrocGameContent'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { CrocGameSchema } from 'types-party-battle'

export default function CrocScreen() {
  return (
    <GameRoomProvider<CrocGameSchema>>
      <CrocGameView />
    </GameRoomProvider>
  )
}

function CrocGameView() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const { gameRoom, isLoading, joinGameRoom } =
    useGameRoomContext<CrocGameSchema>()

  useEffect(() => {
    if (roomId && !isLoading && !gameRoom) {
      joinGameRoom(roomId)
    }
  }, [roomId, joinGameRoom, isLoading, gameRoom])

  if (isLoading || !gameRoom) {
    return <Loading />
  }

  return <CrocGameContent gameRoom={gameRoom} />
}
