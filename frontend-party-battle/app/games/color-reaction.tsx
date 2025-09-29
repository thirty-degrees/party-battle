import { ColorReactionGame } from '@/src/games/color-reaction/ColorReactionGame'
import { useColorReactionGameStore } from '@/src/games/color-reaction/useColorReactionStore'
import GameScreen from '@/src/games/GameScreen'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function ColorReactionScreen() {
  const { joinGameRoom, leaveGameRoom, isLoading, activeRoomId, gameStatus } = useColorReactionGameStore(
    useShallow((state) => ({
      joinGameRoom: state.joinById,
      leaveGameRoom: state.leaveRoom,
      isLoading: state.isLoading,
      activeRoomId: state.roomId,
      gameStatus: state.view.status,
    }))
  )

  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  return (
    <GameScreen
      GameComponent={ColorReactionGame}
      joinGameRoom={joinGameRoom}
      leaveGameRoom={leaveGameRoom}
      isLoading={isLoading}
      activeRoomId={activeRoomId}
      gameStatus={gameStatus}
    />
  )
}
