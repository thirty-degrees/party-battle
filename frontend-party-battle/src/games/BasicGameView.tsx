import { ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface BasicGameViewProps {
  children: ReactNode
}

export const BasicGameView = ({ children }: BasicGameViewProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-2 justify-center items-center">
        <View className="flex-1 max-w-md w-full">{children}</View>
      </View>
    </SafeAreaView>
  )
}
