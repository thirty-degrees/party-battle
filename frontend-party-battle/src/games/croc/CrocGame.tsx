import { Text } from '@/components/ui/text'
import { SafeAreaView, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { usePlayerName } from '../../index/PlayerNameProvider'
import { GameComponent } from '../GameComponent'
import TimerProgressBar from './TimerProgressBar'
import ToothButtons from './ToothButtons'

export const CrocGame: GameComponent<CrocGameSchema> = ({ gameRoom }) => {
  const teethCount = useColyseusState(gameRoom, (state) => state.teethCount)
  const pressedTeethIndex = useColyseusState(gameRoom, (state) => Array.from(state.pressedTeethIndex || []))
  const currentPlayer = useColyseusState(gameRoom, (state) => state.currentPlayer)
  const inGamePlayers = useColyseusState(gameRoom, (state) => Array.from(state.inGamePlayers || []))
  const timeWhenTimerIsOver = useColyseusState(gameRoom, (state) => state.timeWhenTimerIsOver)
  const { trimmedPlayerName } = usePlayerName()

  const isCurrentPlayer = currentPlayer === trimmedPlayerName
  const isPlayerInGame = inGamePlayers.some((player) => player.name === trimmedPlayerName)

  const handleToothPress = (toothIndex: number) => {
    if (isCurrentPlayer) {
      gameRoom.send('tooth_pressed', { index: toothIndex })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 justify-center items-center space-y-3">
        <TimerProgressBar
          timeWhenTimerIsOver={timeWhenTimerIsOver}
          isActive={isCurrentPlayer && isPlayerInGame}
        />
        {!isPlayerInGame && (
          <Text className="text-red-500 dark:text-red-400 text-2xl font-bold">You are OUT</Text>
        )}
        {isPlayerInGame && (
          <>
            {isCurrentPlayer && (
              <Text className="text-green-500 dark:text-green-400 text-xl font-bold">
                It&apos;s your turn!
              </Text>
            )}
            {!isCurrentPlayer && currentPlayer && (
              <Text className="text-gray-500 dark:text-gray-400 text-lg">{currentPlayer}&apos;s turn</Text>
            )}
          </>
        )}
      </View>
      <View className="flex-1 items-center justify-center">
        <ToothButtons
          teethCount={teethCount}
          pressedTeethIndex={pressedTeethIndex}
          onToothPress={handleToothPress}
        />
      </View>
    </SafeAreaView>
  )
}
