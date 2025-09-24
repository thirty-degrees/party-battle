import { Text } from '@/components/ui/text'
import { BlurView } from 'expo-blur'
import { Pressable, useColorScheme, View } from 'react-native'

interface BlurredTextProps {
  text: string
  textClassName?: string
  isBlurred?: boolean
  onPress?: () => void
}

export default function BlurredText({ text, isBlurred, onPress }: BlurredTextProps) {
  const colorScheme = useColorScheme()

  return (
    <View className={`flex-col items-left`}>
      <View className="justify-center items-start">
        {isBlurred ? (
          <Pressable onPress={onPress}>
            <BlurView
              intensity={80}
              tint={colorScheme === 'dark' ? 'light' : 'dark'}
              className="rounded self-start overflow-hidden"
            >
              <Text className={`text-md font-semibold opacity-0`}>{text}</Text>
            </BlurView>
          </Pressable>
        ) : (
          <Text className={`text-md font-semibold`}>{text}</Text>
        )}
      </View>
    </View>
  )
}
