import { Room } from 'colyseus.js'
import { Text, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import { Button, ButtonText } from '../../../components/ui/button'
import useColyseusState from '../../colyseus/useColyseusState'

type CrocGameProps = {
  gameRoom: Room<CrocGameSchema>
}

export default function CrocGame({ gameRoom }: CrocGameProps) {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const teethCount = useColyseusState(gameRoom, (state) => state.teethCount)

  const handleToothPress = (toothIndex: number) => {
    console.log(`Tooth ${toothIndex + 1} pressed`)
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6 p-4">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Game Status: {gameStatus}
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Teeth Count: {teethCount}
      </Text>

      <View className="w-80">
        <View className="flex-row justify-center gap-2 mb-2">
          {Array.from({ length: Math.min(6, teethCount) }, (_, index) => (
            <Button
              key={index}
              size="sm"
              action="primary"
              onPress={() => handleToothPress(index)}
            >
              <ButtonText>{index + 1}</ButtonText>
            </Button>
          ))}
        </View>
        {teethCount > 6 && (
          <View className="flex-row justify-center gap-2">
            {Array.from({ length: Math.min(6, teethCount - 6) }, (_, index) => (
              <Button
                key={index + 6}
                size="sm"
                action="primary"
                onPress={() => handleToothPress(index + 6)}
              >
                <ButtonText>{index + 7}</ButtonText>
              </Button>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
