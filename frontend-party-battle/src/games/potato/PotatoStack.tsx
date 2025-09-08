import { View, ViewStyle } from 'react-native'
import PotatoHeatSvg from './PotatoHeatSvg'
import PotatoSvg from './PotatoSvg'

export default function PotatoStack({ style }: { style?: ViewStyle }) {
  return (
    <View className="relative items-center justify-center z-0" style={style}>
      <PotatoHeatSvg />
      <View className="absolute inset-0 items-center justify-center z-1">
        <PotatoSvg />
      </View>
    </View>
  )
}
