import Loading from '@/components/Loading'
import {
  GameRoomProvider,
  useGameRoomContext,
} from '@/src/colyseus/GameRoomProvider'
import useColyseusState from '@/src/colyseus/useColyseusState'
import SnakeGame from '@/src/games/snake/SnakeGame'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { Room } from 'colyseus.js'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { SnakeGameSchema } from 'types-party-battle'

export default function SnakeScreen() {
  return (
    <GameRoomProvider<SnakeGameSchema>>
      <SnakeGameRoomJoiner />
    </GameRoomProvider>
  )
}

function SnakeGameRoomJoiner() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const { gameRoom, isLoading, joinGameRoom } =
    useGameRoomContext<SnakeGameSchema>()

  useEffect(() => {
    if (roomId && !isLoading && !gameRoom) {
      joinGameRoom(roomId)
    }
  }, [roomId, joinGameRoom, isLoading, gameRoom])

  if (isLoading || !gameRoom) {
    return <Loading />
  }

  return <SnakeGameRoomLeaver gameRoom={gameRoom} />
}

type SnakeGameRoomLeaverProps = {
  gameRoom: Room<SnakeGameSchema>
}

function SnakeGameRoomLeaver({ gameRoom }: SnakeGameRoomLeaverProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const { leaveGameRoom } = useGameRoomContext<SnakeGameSchema>()
  const { lobbyRoom } = useLobbyRoomContext()
  const currentGame = useColyseusState(lobbyRoom!, (state) => state.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  return <SnakeGame gameRoom={gameRoom} />
}
