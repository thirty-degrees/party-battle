import { SafeAreaView, Text, View } from 'react-native'
import { SnakeGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'

export const SnakeGame: GameComponent<SnakeGameSchema> = ({ gameRoom }) => {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 justify-center items-center space-y-6">
        <Text className="text-black dark:text-white text-2xl font-bold">Snake Mini Game</Text>
        <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
      </View>
    </SafeAreaView>
  )
}
