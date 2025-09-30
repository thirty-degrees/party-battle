import { View } from 'react-native'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { ArrowButtonControls } from './ArrowButtonControls'
import { Board } from './Board'

export const SnakeGame: GameComponent = () => {
  return (
    <BasicGameView>
      <View className="flex-1 justify-start items-center">
        <Board />
        <ArrowButtonControls />
      </View>
    </BasicGameView>
  )
}
