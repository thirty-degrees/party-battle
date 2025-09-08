import { View } from 'react-native'
import PotatoHeatSvg from './PotatoHeatSvg'
import PotatoSvg from './PotatoSvg'

export default function PotatoStack() {
  return (
    <View className="relative items-center justify-center z-0">
      <PotatoHeatSvg />
      <View className="absolute inset-0 items-center justify-center z-1">
        <PotatoSvg />
      </View>
    </View>
  )
}
