import { Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponentProps } from '../GameComponent'
import PotatoSvg from './PotatoSvg'

export default function PotatoGame({ gameRoom }: GameComponentProps<PotatoGameSchema>) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <PotatoSvg />
      <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
    </View>
  )
}
