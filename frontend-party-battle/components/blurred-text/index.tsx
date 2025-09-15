import { Text } from '@/components/ui/text'
import { BlurView } from 'expo-blur'
import { useState } from 'react'
import { TouchableOpacity, useColorScheme, View } from 'react-native'

interface BlurredTextProps {
  text: string
  className?: string
  textClassName?: string
}

export default function BlurredText({
  text,
  className = '',
  textClassName = 'text-md font-semibold text-left',
}: BlurredTextProps) {
  const [isBlurred, setIsBlurred] = useState(true)
  const colorScheme = useColorScheme()

  const handleToggle = () => {
    setIsBlurred((prev) => !prev)
  }

  return (
    <TouchableOpacity
      onPress={handleToggle}
      className={`flex-col items-left ${className}`}
      activeOpacity={0.7}
    >
      <View className="h-8 justify-center items-start">
        {isBlurred ? (
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'light' : 'dark'}
            className="w-full rounded self-start overflow-hidden"
          >
            <Text className={`${textClassName} opacity-0`}>{text}</Text>
          </BlurView>
        ) : (
          <Text className={textClassName}>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
