import useColyseusState from '@/src/colyseus/useColyseusState'
import { Room } from 'colyseus.js'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import { useGameRoomContext } from '../colyseus/GameRoomProvider'
import { useLobbyRoomContext } from '../lobby/LobbyRoomProvider'

type CrocGameProps = {
  gameRoom: Room<CrocGameSchema>
}

export default function CrocGameContent({ gameRoom }: CrocGameProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const { leaveGameRoom } = useGameRoomContext<CrocGameSchema>()
  const { lobbyRoom } = useLobbyRoomContext()
  const currentGame = useColyseusState(lobbyRoom!, (state) => state.currentGame)

  useEffect(() => {
    if (gameStatus === 'finished' && !currentGame) {
      leaveGameRoom()
      router.push('/lobby')
    }
  }, [gameStatus, leaveGameRoom, currentGame])

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room State: {JSON.stringify(gameStatus)}
      </Text>
    </View>
  )
}
