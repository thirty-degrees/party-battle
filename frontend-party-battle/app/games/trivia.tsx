import GameScreen from '@/src/games/GameScreen'
import { TriviaGame } from '@/src/games/trivia/TriviaGame'
import { useTriviaGameStore } from '@/src/games/trivia/useTriviaGameStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function TriviaScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus, connectionLost, roomError } =
    useTriviaGameStore(
      useShallow((state) => ({
        joinGameRoom: state.joinById,
        leaveGameRoom: state.leaveRoom,
        isLoading: state.isLoading,
        activeRoomId: state.roomId,
        gameStatus: state.view.status,
        connectionLost: state.connectionLost,
        roomError: state.roomError,
      }))
    )

  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  return (
    <GameScreen
      GameComponent={TriviaGame}
      joinGameRoom={joinGameRoom}
      leaveGameRoom={leaveGameRoom}
      isGameRoomLoading={isLoading}
      activeGameRoomId={activeRoomId}
      gameStatus={gameStatus}
      connectionToGameRoomLost={connectionLost}
      gameRoomError={roomError}
    />
  )
}
