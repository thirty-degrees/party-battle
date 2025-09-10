import { Text } from '@/components/ui/text'
import { Dimensions, SafeAreaView, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { usePlayerName } from '../../index/PlayerNameProvider'
import { GameComponent } from '../GameComponent'
import TimerProgressBar from './TimerProgressBar'
import ToothButtons from './ToothButtons'
import SkullExplodingSvgComponent from './skullExplodingSvgComponent'
import SkullSvgComponent from './skullSvgComponent'

export const CrocGame: GameComponent<CrocGameSchema> = ({ gameRoom }) => {
  const teethCount = useColyseusState(gameRoom, (state) => state.teethCount)
  const pressedTeethIndex = useColyseusState(gameRoom, (state) => Array.from(state.pressedTeethIndex || []))
  const currentPlayer = useColyseusState(gameRoom, (state) => state.currentPlayer)
  const inGamePlayers = useColyseusState(gameRoom, (state) => Array.from(state.inGamePlayers || []))
  const timeWhenTimerIsOver = useColyseusState(gameRoom, (state) => state.timeWhenTimerIsOver)
  const { trimmedPlayerName } = usePlayerName()

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  const isCurrentPlayer = currentPlayer === trimmedPlayerName
  const isPlayerInGame = inGamePlayers.some((player) => player.name === trimmedPlayerName)

  const handleToothPress = (toothIndex: number) => {
    if (isCurrentPlayer) {
      gameRoom.send('tooth_pressed', { index: toothIndex })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 items-center justify-center">
        <View className="flex-1 items-center justify-center">
          <View style={{ height: 80 }} className="items-center justify-center">
            {!isPlayerInGame && (
              <Text className="text-red-500 dark:text-red-400 text-2xl font-bold">
                You picked the WRONG card!
              </Text>
            )}
            {isPlayerInGame && isCurrentPlayer && (
              <Text className="text-green-500 dark:text-green-400 text-xl font-bold">
                It&apos;s your turn!
              </Text>
            )}
            {isPlayerInGame && !isCurrentPlayer && currentPlayer && (
              <Text className="text-gray-500 dark:text-gray-400 text-lg">{currentPlayer}&apos;s turn</Text>
            )}
          </View>
          <View
            style={{
              width: Math.min(screenWidth * 0.8, 320),
              height: Math.min(screenHeight * 0.4, 400),
            }}
          >
            {isPlayerInGame ? <SkullSvgComponent /> : <SkullExplodingSvgComponent />}
          </View>
        </View>
      </View>

      <View className="items-center mb-2"></View>

      <View className="items-center h-12">
        <TimerProgressBar
          timeWhenTimerIsOver={timeWhenTimerIsOver}
          isActive={isCurrentPlayer && isPlayerInGame}
        />
        {!isPlayerInGame && (
          <Text className="text-gray-600 dark:text-gray-400 text-lg mb-5">
            The other players are still trying their luck
          </Text>
        )}
      </View>

      <View className="items-center mb-8">
        <View style={{ opacity: isPlayerInGame ? 1 : 0.5 }}>
          <ToothButtons
            teethCount={teethCount}
            pressedTeethIndex={pressedTeethIndex}
            onToothPress={handleToothPress}
            disabled={!isPlayerInGame}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
