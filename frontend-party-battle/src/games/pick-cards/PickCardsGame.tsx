import { Text } from '@/components/ui/text'
import { Dimensions, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { ShakingScreen } from '../../../components/shaking-screen/ShakingScreen'
import { usePlayerName } from '../../storage/userPreferencesStore'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import Cards from './Cards'
import SkullExplodingSvgComponent from './skullExplodingSvgComponent'
import SkullSvgComponent from './skullSvgComponent'
import TimerProgressBar from './TimerProgressBar'
import { usePickCardsGameStore } from './usePickCardsStore'

export const PickCardsGame: GameComponent = () => {
  const {
    status,
    cardCount,
    pressedCardIndex,
    currentPlayer,
    remainingPlayers,
    timeWhenTimerIsOver,
    sendMessage,
  } = usePickCardsGameStore(
    useShallow((state) => ({
      status: state.view.status,
      cardCount: state.view.cardCount,
      pressedCardIndex: state.view.pressedCardIndex,
      currentPlayer: state.view.currentPlayer,
      remainingPlayers: state.view.remainingPlayers,
      timeWhenTimerIsOver: state.view.timeWhenTimerIsOver,
      sendMessage: state.sendMessage,
    }))
  )
  const { playerName } = usePlayerName()

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  const isCurrentPlayer = currentPlayer === playerName
  const isPlayerInGame = remainingPlayers.some((name) => name === playerName)

  const handleCardPress = (toothIndex: number) => {
    if (isCurrentPlayer) {
      sendMessage('CardPressed', { index: toothIndex })
    }
  }

  return (
    <ShakingScreen run={!isPlayerInGame && status !== 'waiting'}>
      <BasicGameView>
        <View className="flex-1 items-center justify-center">
          <View className="flex-1 items-center justify-center">
            <View style={{ height: 80 }} className="items-center justify-center">
              {isPlayerInGame && remainingPlayers.length === 1 ? (
                <Text className="text-red-400 text-xl font-bold text-center">
                  This time, the luck was on your side!
                </Text>
              ) : (
                <>
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
                    <Text className="text-gray-500 dark:text-gray-400 text-lg">
                      {currentPlayer}&apos;s turn
                    </Text>
                  )}
                </>
              )}
            </View>
            <View
              style={{
                width: Math.min(screenWidth * 0.7, 320),
                height: Math.min(screenHeight * 0.3, 350),
              }}
            >
              {isPlayerInGame ? <SkullSvgComponent /> : <SkullExplodingSvgComponent />}
            </View>
          </View>
        </View>

        <View className="items-center h-12">
          <TimerProgressBar
            timeWhenTimerIsOver={timeWhenTimerIsOver}
            isActive={isCurrentPlayer && isPlayerInGame}
          />
          {!isPlayerInGame && (
            <Text className="text-gray-600 dark:text-gray-400 text-lg mb-5 text-center">You are out!</Text>
          )}
        </View>

        <View className="items-center mb-8">
          <Cards
            cardCount={cardCount}
            pressedCardIndex={pressedCardIndex}
            onCardPress={handleCardPress}
            disabled={!isPlayerInGame || !isCurrentPlayer}
          />
        </View>
      </BasicGameView>
    </ShakingScreen>
  )
}
