import { Room } from 'colyseus.js'
import { Text, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import ToothButtons from './ToothButtons'

type CrocGameProps = {
  gameRoom: Room<CrocGameSchema>
}

export default function CrocGame({ gameRoom }: CrocGameProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const teethCount = useColyseusState(gameRoom, (state) => state.teethCount)
  const pressedTeethIndex = useColyseusState(gameRoom, (state) => Array.from(state.pressedTeethIndex || []))

  const handleToothPress = (toothIndex: number) => {
    gameRoom.send('tooth_pressed', { index: toothIndex })
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-12 p-4">
      <Text className="text-black dark:text-white text-2xl font-bold">Croc Mini Game</Text>
      <Text className="text-black dark:text-white text-lg">Game Status: {gameStatus}</Text>
      <Text className="text-black dark:text-white text-lg">Teeth Count: {teethCount}</Text>

      <ToothButtons
        teethCount={teethCount}
        pressedTeethIndex={pressedTeethIndex}
        onToothPress={handleToothPress}
      />
    </View>
  )
}
