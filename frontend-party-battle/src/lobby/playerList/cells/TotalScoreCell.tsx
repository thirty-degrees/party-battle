import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { useTotalScores } from '../../useTotalScroes'

type TotalScoreCellProps = {
  playerName: string
}

export function TotalScoreCell({ playerName }: TotalScoreCellProps) {
  const totalScore = useTotalScores()[playerName]

  return (
    <View className="w-10 items-end">
      <Text className={`text-black dark:text-white text-end`}>{totalScore}</Text>
    </View>
  )
}
