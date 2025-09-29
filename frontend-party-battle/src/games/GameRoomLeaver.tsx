import { Text } from '@/components/ui/text'
import { useGameRoomContext } from '@/src/colyseus/GameRoomProvider'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { Room } from 'colyseus.js'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { GameSchema } from 'types-party-battle/types/GameSchema'
import { GameComponent } from './GameComponent'

interface GameRoomLeaverProps<T extends GameSchema> {
  GameComponent: GameComponent<T>
  gameRoom: Room<T>
}

export default function GameRoomLeaver<T extends GameSchema>({
  GameComponent,
  gameRoom,
}: GameRoomLeaverProps<T>) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const { leaveGameRoom } = useGameRoomContext<T>()
  const currentGame = useLobbyStore((state) => state.view.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  return (
    <View className="flex-1">
      <GameComponent gameRoom={gameRoom} />
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
