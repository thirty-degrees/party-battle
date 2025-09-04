import useColyseusState from '@/src/colyseus/useColyseusState'
import { Room } from 'colyseus.js'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import { useLobbyRoomContext } from '../lobby/LobbyRoomProvider'
import { useCrocGameContext } from './CrocGameProvider'

type CrocGameProps = {
  room: Room<CrocGameSchema>
}

export default function CrocGameContent({ room }: CrocGameProps) {
  const gameState = useColyseusState(room!, (state) => state.gameState)
  const { leaveCrocGame } = useCrocGameContext()
  const { lobbyRoom } = useLobbyRoomContext()
  const currentGame = useColyseusState(lobbyRoom!, (state) => state.currentGame)

  useEffect(() => {
    if (gameState === 'finished' && !currentGame) {
      leaveCrocGame()
      router.push('/lobby')
    }
  }, [gameState, leaveCrocGame, currentGame])

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room State: {JSON.stringify(gameState)}
      </Text>
    </View>
  )
}
