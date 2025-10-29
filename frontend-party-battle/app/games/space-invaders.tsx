import GameScreen from '@/src/games/GameScreen'
import { SpaceInvadersGame } from '@/src/games/space-invaders/SpaceInvadersGame'
import { useSpaceInvadersStore } from '@/src/games/space-invaders/useSpaceInvadersStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function SpaceInvadersScreen() {
  const { joinById, leaveRoom, isLoading, roomId, status, connectionLost, error } = useSpaceInvadersStore(
    useShallow((s) => ({
      joinById: s.joinById,
      leaveRoom: s.leaveRoom,
      isLoading: s.isLoading,
      roomId: s.roomId,
      status: s.view.status,
      connectionLost: s.connectionLost,
      error: s.roomError,
    }))
  )

  const isFocused = useIsFocused()
  if (!isFocused) return null

  return (
    <GameScreen
      GameComponent={SpaceInvadersGame}
      joinGameRoom={joinById}
      leaveGameRoom={leaveRoom}
      isGameRoomLoading={isLoading}
      activeGameRoomId={roomId}
      gameStatus={status}
      connectionToGameRoomLost={connectionLost}
      gameRoomError={error}
    />
  )
}
