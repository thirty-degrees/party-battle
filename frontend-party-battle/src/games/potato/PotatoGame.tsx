import { Room } from 'colyseus.js'
import { Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'

type PotatoGameProps = {
  gameRoom: Room<PotatoGameSchema>
}

export default function PotatoGame({ gameRoom }: PotatoGameProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">Potato Mini Game</Text>

      <Text className="text-black dark:text-white text-lg">Room State: {JSON.stringify(gameStatus)}</Text>
    </View>
  )
}
