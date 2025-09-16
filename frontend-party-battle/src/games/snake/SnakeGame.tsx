import { Text } from 'react-native'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import useColyseusState from '../../colyseus/useColyseusState'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'

export const SnakeGame: GameComponent<SnakeGameSchema> = ({ gameRoom }) => {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <BasicGameView>
      <Text className="text-black dark:text-white text-2xl font-bold">Snake Mini Game</Text>
      <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
    </BasicGameView>
  )
}
