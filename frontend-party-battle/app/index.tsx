import TouchableDismissKeyboard from '@/components/touchable-dismiss-keyboard'
import { JoinSection } from '@/src/index/JoinSection'
import { LogoSection } from '@/src/index/LogoSection'
import { NameSection } from '@/src/index/NameSection'
import { StoreBadges } from '@/src/index/StoreBadges'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <TouchableDismissKeyboard>
      <SafeAreaView className="flex-1 items-center bg-background-0 dark:bg-background-950">
        <View className="flex-1 w-full max-w-md p-4 ">
          <View className="flex-1 w-full justify-around items-center">
            <NameSection />
            <LogoSection />
            <JoinSection />
          </View>
          <View className="h-10 mt-[15%]">
            <StoreBadges />
          </View>
        </View>
      </SafeAreaView>
    </TouchableDismissKeyboard>
  )
}
