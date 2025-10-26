import { View } from 'react-native'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { Arena } from './components/Arena'
import { SpaceControls } from './components/SpaceControls'

export const SpaceInvadersGame: GameComponent = () => {
  return (
    <BasicGameView>
      <View className="flex-1 items-center justify-start">
        <Arena />
        <SpaceControls />
      </View>
    </BasicGameView>
  )
}
