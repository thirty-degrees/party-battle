import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { usePlayerColorString } from '../../usePlayerColorString'

type NameCellProps = {
  playerName: string
}

export function NameCell({ playerName }: NameCellProps) {
  const playerColorString = usePlayerColorString(playerName)

  return (
    <View className="flex-1 flex-row justify-start gap-2 items-center ml-3">
      <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: playerColorString }} />
      <Text className={'text-black dark:text-white'}>{playerName}</Text>
    </View>
  )
}
