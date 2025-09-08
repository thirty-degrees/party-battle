import { Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import PotatoHeatSvg from './PotatoHeatSvg'
import PotatoSvg from './PotatoSvg'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <PotatoHeatSvg />
      <PotatoSvg />
      <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
    </View>
  )
}
