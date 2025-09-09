import { Text, View } from 'react-native'
import { CrocGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { usePlayerName } from '../../index/PlayerNameProvider'
import { GameComponent } from '../GameComponent'
import TimerProgressBar from './TimerProgressBar'
import ToothButtons from './ToothButtons'

export const CrocGame: GameComponent<CrocGameSchema> = ({ gameRoom }) => {
  const gameStatus = useColyseusState(gameRoom, (state) => state.status)
  const teethCount = useColyseusState(gameRoom, (state) => state.teethCount)
  const pressedTeethIndex = useColyseusState(gameRoom, (state) => Array.from(state.pressedTeethIndex || []))
  const currentPlayer = useColyseusState(gameRoom, (state) => state.currentPlayer)
  const inGamePlayers = useColyseusState(gameRoom, (state) => Array.from(state.inGamePlayers || []))
  const timeWhenTimerIsOver = useColyseusState(gameRoom, (state) => state.timeWhenTimerIsOver)
  const { playerName } = usePlayerName()

  const isCurrentPlayer = currentPlayer === playerName
  const isPlayerInGame = inGamePlayers.some((player) => player.name === playerName)

  const handleToothPress = (toothIndex: number) => {
    if (isCurrentPlayer) {
      gameRoom.send('tooth_pressed', { index: toothIndex })
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-12 p-4">
      <Text className="text-black dark:text-white text-2xl font-bold">Croc Mini Game</Text>
      <Text className="text-black dark:text-white text-lg">Game Status: {gameStatus}</Text>
      <Text className="text-black dark:text-white text-lg">Teeth Count: {teethCount}</Text>

      {!isPlayerInGame && (
        <Text className="text-red-500 dark:text-red-400 text-2xl font-bold">You are OUT</Text>
      )}

      {isCurrentPlayer && isPlayerInGame && (
        <>
          <Text className="text-green-500 dark:text-green-400 text-xl font-bold">It&apos;s your turn!</Text>
          <TimerProgressBar
            timeWhenTimerIsOver={timeWhenTimerIsOver}
            isActive={isCurrentPlayer && isPlayerInGame}
          />
        </>
      )}

      {!isCurrentPlayer && currentPlayer && isPlayerInGame && (
        <Text className="text-gray-500 dark:text-gray-400 text-lg">{currentPlayer}&apos;s turn</Text>
      )}

      <ToothButtons
        teethCount={teethCount}
        pressedTeethIndex={pressedTeethIndex}
        onToothPress={handleToothPress}
      />
    </View>
  )
}
