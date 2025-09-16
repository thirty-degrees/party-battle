import { ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GAME_VIEW_PADDING, MAX_GAME_WIDTH } from './constants'

interface BasicGameViewProps {
  children: ReactNode
}

export const BasicGameView = ({ children }: BasicGameViewProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 justify-center items-center" style={{ padding: GAME_VIEW_PADDING }}>
        <View className="flex-1 w-full" style={{ maxWidth: MAX_GAME_WIDTH }}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  )
}
