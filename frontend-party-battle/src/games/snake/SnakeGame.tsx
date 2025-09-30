import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { ArrowButtonControls } from './ArrowButtonControls'
import { Board } from './Board'
import { useSnakeGameStore } from './useSnakeStore'

export const SnakeGame: GameComponent = () => {
  const { board, width, height, players } = useSnakeGameStore(
    useShallow((state) => ({
      board: state.view.board,
      width: state.view.width,
      height: state.view.height,
      players: state.view.players,
    }))
  )

  return (
    <BasicGameView>
      <View className="flex-1 justify-start items-center">
        <Board board={board} width={width} height={height} players={players} />
        <ArrowButtonControls />
      </View>
    </BasicGameView>
  )
}
