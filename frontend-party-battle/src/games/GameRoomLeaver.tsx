import { useGameRoomContext } from '@/src/colyseus/GameRoomProvider'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { Room } from 'colyseus.js'
import { router } from 'expo-router'
import { ReactElement, useEffect } from 'react'
import { GameSchema } from 'types-party-battle'

interface GameRoomLeaverProps<T extends GameSchema> {
  GameComponent: (props: { gameRoom: Room<T> }) => ReactElement
  gameRoom: Room<T>
}

export default function GameRoomLeaver<T extends GameSchema>({
  GameComponent,
  gameRoom,
}: GameRoomLeaverProps<T>) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const { leaveGameRoom } = useGameRoomContext<T>()
  const { lobbyRoom } = useLobbyRoomContext()
  const currentGame = useColyseusState(lobbyRoom!, (state) => state.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  return <GameComponent gameRoom={gameRoom} />
}
