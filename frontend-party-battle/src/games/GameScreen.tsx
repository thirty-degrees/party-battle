import Loading from '@/components/loading'
import { Text } from '@/components/ui/text'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from '../lobby/useLobbyStore'
import { GameComponent } from './GameComponent'

interface GameScreenProps {
  GameComponent: GameComponent
  joinGameRoom: (roomId: string) => Promise<boolean>
  leaveGameRoom: () => Promise<void>
  isGameRoomLoading: boolean
  activeGameRoomId?: string
  gameStatus: string
  connectionToGameRoomLost: boolean
  gameRoomError?: unknown
}

export default function GameScreen({
  GameComponent,
  joinGameRoom,
  leaveGameRoom,
  isGameRoomLoading,
  activeGameRoomId,
  gameStatus,
  connectionToGameRoomLost,
  gameRoomError: error,
}: GameScreenProps) {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()

  useEffect(() => {
    if (roomId && !isGameRoomLoading && roomId !== activeGameRoomId) {
      joinGameRoom(roomId)
    }
  }, [roomId, joinGameRoom, isGameRoomLoading, activeGameRoomId])

  const { currentGame, currentGameRoomId } = useLobbyStore(
    useShallow((state) => ({
      currentGame: state.view.currentGame,
      currentGameRoomId: state.view.currentGameRoomId,
    }))
  )

  const requiresRedirectToLobby = Boolean(
    !currentGame || (activeGameRoomId && currentGameRoomId !== activeGameRoomId)
  )

  useEffect(() => {
    if (requiresRedirectToLobby) {
      leaveGameRoom()
    }
  }, [leaveGameRoom, requiresRedirectToLobby])

  if (connectionToGameRoomLost || requiresRedirectToLobby) {
    return <Redirect href="/lobby" />
  }

  if (error) {
    throw error
  }

  if (isGameRoomLoading || roomId !== activeGameRoomId) {
    return <Loading />
  }

  return (
    <View className="flex-1">
      <GameComponent />
      {gameStatus === 'waiting' && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center">
          <View className="p-4 bg-white dark:bg-black w-full items-center">
            <Text size="lg">Get ready</Text>
          </View>
        </View>
      )}
    </View>
  )
}
