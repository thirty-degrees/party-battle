import RainbowText from '@/components/rainbow-text'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function LogoSection() {
  return (
    <View className="flex-row items-center gap-2">
      <Heading size="4xl">
        <RainbowText text="Party" className="text-6xl" />
        <Text className="text-6xl"> Battle</Text>
      </Heading>
    </View>
  )
}
