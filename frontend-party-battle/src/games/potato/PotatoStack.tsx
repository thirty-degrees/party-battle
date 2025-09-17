import { View, ViewStyle } from 'react-native'
import PotatoHeatImage from './PotatoHeatImage'
import PotatoSvg from './PotatoSvg'

export default function PotatoStack({ style }: { style?: ViewStyle }) {
  return (
    <View className="relative items-center justify-center z-0" style={style}>
      <PotatoHeatImage />
      <View className="absolute inset-0 items-center justify-center z-1">
        <PotatoSvg />
      </View>
    </View>
  )
}
