import Loading from '@/components/loading'
import { Text } from '@/components/ui/text'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useLobbyStore } from '../lobby/useLobbyStore'
import { GameComponent } from './GameComponent'

interface GameScreenProps {
  GameComponent: GameComponent
  joinGameRoom: (roomId: string) => Promise<boolean>
  leaveGameRoom: () => Promise<void>
  isLoading: boolean
  activeRoomId?: string
  gameStatus: string
  connectionLost: boolean
  error?: unknown
}

export default function GameScreen({
  GameComponent,
  joinGameRoom,
  leaveGameRoom,
  isLoading,
  activeRoomId,
  gameStatus,
  connectionLost,
  error,
}: GameScreenProps) {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()

  useEffect(() => {
    if (roomId && !isLoading && roomId !== activeRoomId) {
      joinGameRoom(roomId)
    }
  }, [roomId, joinGameRoom, isLoading, activeRoomId])

  const currentGame = useLobbyStore((state) => state.view.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  if (connectionLost) {
    return <Redirect href="/lobby" />
  }

  if (error) {
    throw error
  }

  if (isLoading || roomId !== activeRoomId) {
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
