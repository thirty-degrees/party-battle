import { Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import PotatoStack from './PotatoStack'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const message = useColyseusState(gameRoom, (state) => state.message)

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-xl">{message}</Text>
      <PotatoStack style={{ width: 300, height: 400 }} />
    </View>
  )
}
