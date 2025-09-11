import { ReactNode } from 'react'
import { SafeAreaView, View } from 'react-native'

interface BasicGameViewProps {
  children: ReactNode
}

export const BasicGameView = ({ children }: BasicGameViewProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full">{children}</View>
      </View>
    </SafeAreaView>
  )
}
