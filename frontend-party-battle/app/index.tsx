import TouchableDismissKeyboard from '@/components/touchable-dismiss-keyboard'
import { IndexContent } from '@/src/index/IndexContent'
import { StoreBadges } from '@/src/index/StoreBadges'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <TouchableDismissKeyboard>
      <SafeAreaView className="flex-1 items-center bg-background-0 dark:bg-background-950">
        <View className="flex-1 w-full max-w-md p-4 ">
          <IndexContent />
          <View className="h-10 mt-[15%]">
            <StoreBadges />
          </View>
        </View>
      </SafeAreaView>
    </TouchableDismissKeyboard>
  )
}
