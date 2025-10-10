import { Text } from '@/components/ui/text'
import { TouchableOpacity, View } from 'react-native'

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
  const sortedAnswers = [...answers].sort()

  return (
    <View className="h-full w-full flex-col justify-center gap-4">
      <View className="flex flex-row justify-center gap-4">
        {sortedAnswers.slice(0, 2).map((answer) => (
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
        {sortedAnswers.slice(2, 4).map((answer) => (
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

  const buttonClasses: string[] = ['w-full']
  if (showingResults) {
    if (isCorrect) {
      buttonClasses.push('bg-green-500')
    } else if (isSelected && !isCorrect) {
      buttonClasses.push('bg-red-500')
    } else {
      buttonClasses.push('bg-gray-200 dark:bg-zinc-800 opacity-60')
    }
    buttonClasses.push('border-2 border-transparent')
  } else {
    buttonClasses.push('bg-gray-200 dark:bg-zinc-800', 'border-2')
    if (isSelected) {
      buttonClasses.push('border-blue-500')
    } else {
      buttonClasses.push('border-transparent')
    }
  }

  const finalButtonClasses = [
    ...buttonClasses,
    'flex-1',
    'p-6',
    'justify-center',
    'items-center',
    'rounded-md',
  ].join(' ')

  return (
    <View className="h-full flex-1">
      <TouchableOpacity
        className={finalButtonClasses}
        disabled={disabled || showingResults}
        onPress={() => onAnswerPress(answer)}
      >
        <Text>{answer}</Text>
      </TouchableOpacity>
    </View>
  )
}
