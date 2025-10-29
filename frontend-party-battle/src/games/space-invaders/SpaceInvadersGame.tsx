import { View } from 'react-native'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { Arena } from './components/Arena'
import { PlayerStatusGrid } from './components/PlayerStatusGrid'
import { SpaceControls } from './components/SpaceControls'

export const SpaceInvadersGame: GameComponent = () => {
  return (
    <BasicGameView>
      <View className="flex-1 w-full items-center justify-between">
        <PlayerStatusGrid />
        <View className="flex-1 w-full items-center justify-center">
          <Arena />
        </View>
        <SpaceControls />
      </View>
    </BasicGameView>
  )
}
