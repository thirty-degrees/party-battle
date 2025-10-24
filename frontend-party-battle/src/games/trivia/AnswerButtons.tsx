import { Text } from '@/components/ui/text'
import { Pressable, View } from 'react-native'
type Props = {
  answers: string[]
  onAnswerPress: (answer: string) => void
  selectedAnswer?: string
  correctAnswer?: string
  disabled?: boolean
  showingResults?: boolean
}

export function AnswerButtons({
  answers,
  onAnswerPress,
  selectedAnswer,
  correctAnswer,
  disabled,
  showingResults,
}: Props) {
  return (
    <View className="w-full flex-col justify-center gap-4">
      <View className="flex flex-row justify-center gap-4">
        {answers.slice(0, 2).map((answer) => (
          <AnswerButton
            key={answer}
            answer={answer}
            onAnswerPress={onAnswerPress}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            disabled={disabled}
            showingResults={showingResults}
          />
        ))}
      </View>
      <View className="flex flex-row justify-center gap-4">
        {answers.slice(2, 4).map((answer) => (
          <AnswerButton
            key={answer}
            answer={answer}
            onAnswerPress={onAnswerPress}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            disabled={disabled}
            showingResults={showingResults}
          />
        ))}
      </View>
    </View>
  )
}

type AnswerButtonProps = {
  answer: string
} & Omit<Props, 'answers'>

function AnswerButton({
  answer,
  onAnswerPress,
  selectedAnswer,
  correctAnswer,
  disabled,
  showingResults,
}: AnswerButtonProps) {
  const isSelected = selectedAnswer === answer
  const isCorrect = correctAnswer === answer

  const getButtonStyle = () => {
    let baseClasses = 'flex-1 w-full justify-center items-center rounded-md p-2 border-2'
    let isCorrectColorBg = 'bg-green-200 dark:bg-green-500'
    let isSelectedColorBorder = 'border-blue-400 dark:border-blue-600'
    let isDefaultColorBg = 'bg-primary-500 dark:bg-primary-500'

    if (showingResults && isCorrect) {
      if (isSelected) {
        return `${baseClasses} ${isCorrectColorBg} ${isSelectedColorBorder}`
      }
      return `${baseClasses} ${isCorrectColorBg} border-transparent`
    }

    if (isSelected) {
      return `${baseClasses} ${isSelectedColorBorder} ${isDefaultColorBg}`
    }

    return `${baseClasses} ${isDefaultColorBg} border-transparent`
  }

  return (
    <Pressable
      className={getButtonStyle()}
      onPress={() => onAnswerPress(answer)}
      disabled={disabled || showingResults}
    >
      <Text className="text-black dark:text-white text-center">{answer}</Text>
    </Pressable>
  )
}
