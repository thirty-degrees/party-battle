import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { SafeAreaView, Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import PotatoStack from './PotatoStack'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const message = useColyseusState(gameRoom, (state) => state.message)
  const playerWithPotato = useColyseusState(gameRoom, (state) => state.playerWithPotato)
  const { trimmedPlayerName } = usePlayerName()

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 justify-center items-center space-y-6">
        <Text className="text-black dark:text-white text-xl">{message}</Text>
        {playerWithPotato === trimmedPlayerName && <PotatoStack style={{ width: 300, height: 400 }} />}
      </View>
    </SafeAreaView>
  )
}
