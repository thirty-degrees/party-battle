import { ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GAME_VIEW_PADDING, MAX_GAME_WIDTH } from './constants'

interface BasicGameViewProps {
  children: ReactNode
  className?: string
}

export const BasicGameView = ({ children, className }: BasicGameViewProps) => {
  return (
    <SafeAreaView className={`flex-1 bg-background-0 dark:bg-background-950 ${className}`}>
      <View className="flex-1 justify-center items-center" style={{ padding: GAME_VIEW_PADDING }}>
        <View className="flex-1 w-full" style={{ maxWidth: MAX_GAME_WIDTH }}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  )
}
