import GameScreen from '@/src/games/GameScreen'
import { PotatoGame } from '@/src/games/potato/PotatoGame'
import { usePotatoGameStore } from '@/src/games/potato/usePotatoStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function PotatoScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus, connectionLost, error } =
    usePotatoGameStore(
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
      GameComponent={PotatoGame}
      joinGameRoom={joinGameRoom}
      leaveGameRoom={leaveGameRoom}
      isLoading={isLoading}
      activeRoomId={activeRoomId}
      gameStatus={gameStatus}
      connectionLost={connectionLost}
      error={error}
    />
  )
}
