import { AnimatedCountdownNumber } from '@/components/animated-countdown-number'
import { Text } from '@/components/ui/text'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import TimerProgressBar from '../pick-cards/TimerProgressBar'
import { AnswerButtons } from './AnswerButtons'
import { InGameLeaderboard } from './InGameLeaderboard'
import { useTriviaGameStore } from './useTriviaGameStore'

export const TriviaGame: GameComponent = () => {
  const {
    currentQuestion,
    currentCountdownNumber,
    playerScores,
    players,
    roundState,
    timeWhenTimerIsOver,
    currentRound,
    totalRounds,
  } = useTriviaGameStore(
    useShallow((state) => ({
      currentQuestion: state.view.currentQuestion,
      currentCountdownNumber: state.view.currentCountdownNumber,
      playerScores: state.view.playerScores,
      players: state.view.players,
      roundState: state.view.roundState,
      timeWhenTimerIsOver: state.view.timeWhenTimerIsOver,
      currentRound: state.view.currentRound,
      totalRounds: state.view.totalRounds,
    }))
  )

  const { sendMessage } = useTriviaGameStore(useShallow((s) => ({ sendMessage: s.sendMessage })))

  const allAnswers = currentQuestion?.allAnswers ?? []

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
      <View className="flex-1 flex-column">
        <InGameLeaderboard players={players} playerScores={playerScores} />
        <View className="flex-1 justify-center items-center px-4 ">
          {currentCountdownNumber ? (
            <AnimatedCountdownNumber value={currentCountdownNumber} size="big" />
          ) : (
            <View className="flex-1 flex-column w-full">
              <View className="w-full">
                <View className="items-center py-2">
                  <Text className="text-lg font-semibold">
                    Round {currentRound}/{totalRounds}
                  </Text>
                </View>
                <Text className="text-2xl text-center">{currentQuestion?.question ?? ''}</Text>
              </View>
              {isAnswering ? (
                <View className="w-full flex-1 flex-column justify-end">
                  <View className="w-full flex-1 items-center justify-end pb-10 ">
                    <AnswerButtons
                      answers={allAnswers}
                      onAnswerPress={handleAnswerPress}
                      disabled={!!selectedAnswer}
                      selectedAnswer={selectedAnswer}
                      showingResults={false}
                    />
                  </View>
                  <View className="w-full h-10 items-center justify-center">
                    <TimerProgressBar timeWhenTimerIsOver={timeWhenTimerIsOver ?? 0} isActive={isAnswering} />
                  </View>
                </View>
              ) : isShowingResults ? (
                <View className="w-full flex-1 flex-column justify-end">
                  <View className="w-full flex-1 items-center justify-end pb-10 ">
                    <AnswerButtons
                      answers={allAnswers}
                      onAnswerPress={() => {}}
                      showingResults
                      correctAnswer={currentQuestion.allAnswers[currentQuestion.correctAnswerIndex]}
                      selectedAnswer={selectedAnswer}
                    />
                  </View>
                  <View className="w-full h-10 items-center justify-center">
                    {!selectedAnswer ? (
                      <Text className="text-red-400  dark:text-red-400 text-xl text-center">
                        No answer, no points.
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </BasicGameView>
  )
}
