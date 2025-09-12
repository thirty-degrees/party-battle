import * as Animatable from 'react-native-animatable'

export function ShakingScreen({ children, run }: { children: React.ReactNode; run: boolean }) {
  return (
    <Animatable.View
      animation={run ? 'shake' : undefined}
      duration={600}
      iterationCount={1}
      useNativeDriver
      style={{ flex: 1 }}
    >
      {children}
    </Animatable.View>
  )
}
