import { View } from 'react-native'

export function ShakingScreen({ children, run }: { children: React.ReactNode; run: boolean }) {
  return <View className="flex-1">{children}</View>
}
