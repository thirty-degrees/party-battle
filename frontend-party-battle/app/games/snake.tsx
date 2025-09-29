import GameScreen from '@/src/games/GameScreen'
import { SnakeGame } from '@/src/games/snake/SnakeGame'
import { useSnakeGameStore } from '@/src/games/snake/useSnakeStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function SnakeScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus, connectionLost, error } =
    useSnakeGameStore(
      useShallow((state) => ({
        joinGameRoom: state.joinById,
        leaveGameRoom: state.leaveRoom,
        isLoading: state.isLoading,
        activeRoomId: state.roomId,
        gameStatus: state.view.status,
        connectionLost: state.connectionLost,
        error: state.roomError,
      }))
    )

  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  return (
    <GameScreen
      GameComponent={SnakeGame}
      joinGameRoom={joinGameRoom}
      leaveGameRoom={leaveGameRoom}
      isGameRoomLoading={isLoading}
      activeGameRoomId={activeRoomId}
      gameStatus={gameStatus}
      connectionToGameRoomLost={connectionLost}
      gameRoomError={error}
    />
  )
}
