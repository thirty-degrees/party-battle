import { Text } from '@/components/ui/text'
import { BlurView } from 'expo-blur'
import { useColorScheme, View } from 'react-native'

interface BlurredTextProps {
  text: string
  textClassName?: string
  isBlurred?: boolean
}

export default function BlurredText({ text, isBlurred }: BlurredTextProps) {
  const colorScheme = useColorScheme()

  return (
    <View className={`flex-col items-left`}>
      <View className="justify-center items-start">
        {isBlurred ? (
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'light' : 'dark'}
            className="w-full rounded self-start overflow-hidden"
          >
            <Text className={`text-md font-semibold opacity-0`}>{text}</Text>
          </BlurView>
        ) : (
          <Text className={`text-md font-semibold`}>{text}</Text>
        )}
      </View>
    </View>
  )
}
