import { Text } from '@/components/ui/text'
import { Dimensions, View } from 'react-native'
import { PickCardsGameSchema } from 'types-party-battle/types/pick-cards/PickCardsGameSchema'
import { ShakingScreen } from '../../../components/shaking-screen/ShakingScreen'
import useColyseusState from '../../colyseus/useColyseusState'
import { usePlayerName } from '../../storage/usePlayerName'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import Cards from './Cards'
import SkullExplodingSvgComponent from './skullExplodingSvgComponent'
import SkullSvgComponent from './skullSvgComponent'
import TimerProgressBar from './TimerProgressBar'

export const PickCardsGame: GameComponent<PickCardsGameSchema> = ({ gameRoom }) => {
  const cardCount = useColyseusState(gameRoom, (state: PickCardsGameSchema) => state.cardCount)
  const pressedCardIndex = useColyseusState(gameRoom, (state: PickCardsGameSchema) =>
    Array.from(state.pressedCardIndex || [])
  )
  const currentPlayer = useColyseusState(gameRoom, (state) => state.currentPlayer)
  const inGamePlayers = useColyseusState(gameRoom, (state) => Array.from(state.inGamePlayers || []))
  const timeWhenTimerIsOver = useColyseusState(gameRoom, (state) => state.timeWhenTimerIsOver)
  const { trimmedPlayerName } = usePlayerName()

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  const isCurrentPlayer = currentPlayer === trimmedPlayerName
  const isPlayerInGame = inGamePlayers.some((player) => player.name === trimmedPlayerName)

  const handleCardPress = (toothIndex: number) => {
    if (isCurrentPlayer) {
      gameRoom.send('CardPressed', { index: toothIndex })
    }
  }

  return (
    <ShakingScreen run={!isPlayerInGame}>
      <BasicGameView>
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
            <Text className="text-gray-600 dark:text-gray-400 text-lg mb-5">
              The other players are still trying their luck
            </Text>
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
