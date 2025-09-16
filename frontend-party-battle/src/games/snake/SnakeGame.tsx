import { Text } from 'react-native'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import useColyseusState from '../../colyseus/useColyseusState'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'

export const SnakeGame: GameComponent<SnakeGameSchema> = ({ gameRoom }) => {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const width = useColyseusState(gameRoom, (state) => state.width)
  const height = useColyseusState(gameRoom, (state) => state.height)
  const board = useColyseusState(gameRoom, (state) => state.board)

  return (
    <BasicGameView>
      <Text className="text-black dark:text-white text-2xl font-bold">Snake Mini Game</Text>
      <Text className="text-black dark:text-white text-lg">Room status: {JSON.stringify(gameStatus)}</Text>
      <Text className="text-black dark:text-white text-lg">Width: {JSON.stringify(width)}</Text>
      <Text className="text-black dark:text-white text-lg">Height: {JSON.stringify(height)}</Text>
      <Text className="text-black dark:text-white text-lg">Board: {JSON.stringify(board)}</Text>
    </BasicGameView>
  )
}
