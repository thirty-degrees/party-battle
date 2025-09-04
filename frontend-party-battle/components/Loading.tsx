import { Spinner } from '@/components/ui/spinner'
import { View } from 'react-native'

export default function Loading() {
  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center">
      <Spinner size="large" />
    </View>
  )
}
