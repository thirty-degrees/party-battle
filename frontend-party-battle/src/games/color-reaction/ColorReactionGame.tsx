import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { AnimatedColorButtons } from './AnimatedColorButtons'
import { ColorButtons } from './ColorButtons'
import { CurrentCountdownNumber } from './CurrentCountdownNumber'
import { useColorReactionGameStore } from './useColorReactionStore'

export const ColorReactionGame: GameComponent = () => {
  const {
    selectionType,
    currentSelection,
    currentCountdownNumber,
    correctGuess,
    guesserName,
    colorIdButtons,
  } = useColorReactionGameStore(
    useShallow((state) => ({
      selectionType: state.view.selectiontype,
      currentSelection: state.view.currentSelection,
      currentCountdownNumber: state.view.currentCountdownNumber,
      correctGuess: state.view.correctGuess,
      guesserName: state.view.guesserName,
      colorIdButtons: state.view.colorIdButtons,
    }))
  )

  const isAnimating = !!currentCountdownNumber && !currentSelection

  const { sendMessage } = useColorReactionGameStore(
    useShallow((state) => ({ sendMessage: state.sendMessage }))
  )

  const handleSquarePress = (color: RGBColor) => {
    sendMessage('ColorPressed', color)
  }

  return (
    <BasicGameView>
      <View className="flex-1 flex-column space-between">
        <View className="w-full justify-center align-center pt-8 pb-8">
          <View className="flex-row justify-center h-8">
            {!isAnimating ? <Text className="text-xl font-bold mb-8">Select the {selectionType}</Text> : null}
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
