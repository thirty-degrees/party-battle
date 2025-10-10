import { Text } from '@/components/ui/text'
import TimerProgressBar from '@/src/games/pick-cards/TimerProgressBar'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { AnswerButtons } from './AnswerButtons'
import { InGameLeaderboard } from './InGameLeaderboard'
import { useTriviaGameStore } from './useTriviaGameStore'

export const TriviaGame: GameComponent = () => {
  const { currentQuestion, currentCountdownNumber, playerScores, players, roundState, timeWhenTimerIsOver } =
    useTriviaGameStore(
      useShallow((state) => ({
        currentQuestion: state.view.currentQuestion,
        currentCountdownNumber: state.view.currentCountdownNumber,
        playerScores: state.view.playerScores,
        players: state.view.players,
        roundState: state.view.roundState,
        timeWhenTimerIsOver: state.view.timeWhenTimerIsOver,
      }))
    )

  const { sendMessage } = useTriviaGameStore(useShallow((s) => ({ sendMessage: s.sendMessage })))

  const allAnswers = currentQuestion
    ? [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers].sort(() => Math.random() - 0.5)
    : []

  const handleAnswerPress = (answer: string) => {
    sendMessage<string>('SubmitAnswer', answer)
    setSelectedAnswer(answer)
  }

  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined)

  useEffect(() => {
    setSelectedAnswer(undefined)
  }, [currentQuestion, currentCountdownNumber])

  const isAnswering = currentQuestion && roundState === 'answering'
  const isShowingResults = currentQuestion && roundState === 'results'

  return (
    <BasicGameView>
      <InGameLeaderboard players={players} playerScores={playerScores} />
      <View className="flex-1 justify-center items-center px-4">
        {currentCountdownNumber ? (
          <Text className="text-6xl font-bold">{currentCountdownNumber}</Text>
        ) : (
          <View className="w-full items-center gap-6">
            <Text className="text-2xl text-center">{currentQuestion?.question ?? ''}</Text>
            {isAnswering ? (
              <>
                <AnswerButtons
                  answers={allAnswers}
                  onAnswerPress={handleAnswerPress}
                  disabled={!!selectedAnswer}
                  selectedAnswer={selectedAnswer}
                  showingResults={false}
                />
                <View className="items-center h-12 w-full">
                  <TimerProgressBar timeWhenTimerIsOver={timeWhenTimerIsOver ?? 0} isActive={isAnswering} />
                </View>
              </>
            ) : isShowingResults ? (
              <>
                <AnswerButtons
                  answers={allAnswers}
                  onAnswerPress={() => {}}
                  showingResults
                  correctAnswer={currentQuestion.correctAnswer}
                  selectedAnswer={selectedAnswer}
                />
                <View className="items-center h-12 w-full">
                  {!selectedAnswer ? (
                    <Text className="text-error-500 text-center">
                      you don&apos;t get points, you didn&apos;t gave an answer.
                    </Text>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        )}
      </View>
    </BasicGameView>
  )
}
