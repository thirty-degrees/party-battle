import { Text } from '@/components/ui/text'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { View } from 'react-native'
import { ColorReactionGameSchema } from 'types-party-battle/types/color-reaction/ColorReactionGameSchema'
import { RGBColorSchema } from 'types-party-battle/types/RGBColorSchema'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { AnimatedColorButtons } from './AnimatedColorButtons'
import { ColorButtons } from './ColorButtons'

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
      <View className="flex-1 justify-between items-center">
        <View flex-1>
          <View className="h-10 justify-center">
            {!isAnimating ? <Text className="text-xl font-bold mb-8">Select the {selectionType}</Text> : null}
          </View>
          <View className="h-16 justify-center">
            {currentSelection ? (
              <Text className="text-4xl font-bold text-center" style={{ color: currentSelection.color }}>
                {currentSelection.word}
              </Text>
            ) : (
              <Text className="text-4xl font-bold text-center">{currentCountdownNumber}</Text>
            )}
          </View>
        </View>
        <View className="flex-1 w-full flex-column justify-center mb-4">
          {guesserName ? (
            <View className="items-center">
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
