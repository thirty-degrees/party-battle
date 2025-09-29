import { Text } from '@/components/ui/text'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { View } from 'react-native'
import { ColorReactionGameSchema } from 'types-party-battle/types/color-reaction/ColorReactionGameSchema'
import { RGBColorSchema } from 'types-party-battle/types/RGBColorSchema'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { AnimatedColorButtons } from './AnimatedColorButtons'
import { ColorButtons } from './ColorButtons'
import { CurrentCountdownNumber } from './CurrentCountdownNumber'

export const ColorReactionGame: GameComponent<ColorReactionGameSchema> = ({ gameRoom }) => {
  const selectionType = useColyseusState(gameRoom, (state) => state.selectiontype)
  const currentSelection = useColyseusState(gameRoom, (state) => state.currentSelection)
  const currentCountdownNumber = useColyseusState(gameRoom, (state) => state.currentCountdownNumber)
  const correctGuess = useColyseusState(gameRoom, (state) => state.correctGuess)
  const guesserName = useColyseusState(gameRoom, (state) => state.guesserName)
  const colorIdButtons = useColyseusState(gameRoom, (state) => Array.from(state.colorIdButtons))

  const isAnimating = !!currentCountdownNumber && !currentSelection

  const handleSquarePress = (color: RGBColorSchema) => {
    gameRoom.send('ColorPressed', color)
  }

  return (
    <BasicGameView>
      <View className="flex-1 flex-column space-between">
        <View className="w-full justify-center align-center pt-8 pb-8">
          <View className="h-8 justify-center">
            {!isAnimating ? (
              <Text className="text-xl font-bold text-center">Select the {selectionType}</Text>
            ) : null}
          </View>
          <View className="h-16 justify-center">
            {currentSelection ? (
              <Text className="text-4xl font-bold text-center" style={{ color: currentSelection.color }}>
                {currentSelection.word}
              </Text>
            ) : (
              <CurrentCountdownNumber value={currentCountdownNumber} />
            )}
          </View>
        </View>
        <View className="w-full flex-1 flex-column justify-end">
          {guesserName ? (
            <View className="h-full justify-center items-center">
              <Text className="text-4xl font-bold mb-4">{guesserName}</Text>
              <Text
                className="text-1xl font-semibold"
                style={{ color: correctGuess ? '#22c55e' : '#ef4444' }}
              >
                Guessed {correctGuess ? 'Correct!' : 'Incorrect!'}
              </Text>
            </View>
          ) : isAnimating ? (
            <AnimatedColorButtons />
          ) : (
            <ColorButtons colorButtons={colorIdButtons} onButtonPress={handleSquarePress} />
          )}
        </View>
      </View>
    </BasicGameView>
  )
}
