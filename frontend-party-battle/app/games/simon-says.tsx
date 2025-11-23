import GameScreen from '@/src/games/GameScreen'
import { SimonSaysGame } from '@/src/games/simon-says/SimonSaysGame'
import { useSimonSaysGameStore } from '@/src/games/simon-says/useSimonSaysStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function SimonSaysScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus, connectionLost, roomError } =
    useSimonSaysGameStore(
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
      GameComponent={SimonSaysGame}
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
