import GameScreen from '@/src/games/GameScreen'
import { PickCardsGame } from '@/src/games/pick-cards/PickCardsGame'
import { usePickCardsGameStore } from '@/src/games/pick-cards/usePickCardsStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function PickCardsScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus, connectionLost, error } =
    usePickCardsGameStore(
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
      GameComponent={PickCardsGame}
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
