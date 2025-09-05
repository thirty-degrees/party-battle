import Loading from '@/components/Loading'
import {
  GameRoomProvider,
  useGameRoomContext,
} from '@/src/colyseus/GameRoomProvider'
import useColyseusState from '@/src/colyseus/useColyseusState'
import CrocGame from '@/src/games/CrocGame'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { Room } from 'colyseus.js'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { CrocGameSchema } from 'types-party-battle'

export default function CrocScreen() {
  return (
    <GameRoomProvider<CrocGameSchema>>
      <CrocGameRoomJoiner />
    </GameRoomProvider>
  )
}

function CrocGameRoomJoiner() {
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

  return <CrocGameRoomLeaver gameRoom={gameRoom} />
}

type CrocGameRoomLeaverProps = {
  gameRoom: Room<CrocGameSchema>
}

function CrocGameRoomLeaver({ gameRoom }: CrocGameRoomLeaverProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const { leaveGameRoom } = useGameRoomContext<CrocGameSchema>()
  const { lobbyRoom } = useLobbyRoomContext()
  const currentGame = useColyseusState(lobbyRoom!, (state) => state.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  return <CrocGame gameRoom={gameRoom} />
}
