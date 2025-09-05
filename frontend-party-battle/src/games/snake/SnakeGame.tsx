import { Room } from 'colyseus.js'
import { Text, View } from 'react-native'
import { SnakeGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'

type SnakeGameProps = {
  gameRoom: Room<SnakeGameSchema>
}

export default function SnakeGame({ gameRoom }: SnakeGameProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">Snake Mini Game</Text>
      <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
    </View>
  )
}
