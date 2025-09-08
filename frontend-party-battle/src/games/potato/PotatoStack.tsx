import { StyleSheet, View } from 'react-native'
import PotatoHeatSvg from './PotatoHeatSvg'
import PotatoSvg from './PotatoSvg'

export default function PotatoStack() {
  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <View style={styles.heatContainer}>
          <PotatoHeatSvg />
        </View>
        <View style={styles.potatoContainer}>
          <PotatoSvg />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'relative',
    width: 495,
    height: 673,
  },
  heatContainer: {
    position: 'absolute',
    top: (673 - 656.725) / 2, // Center vertically: (container - heatSvg) / 2
    left: (495 - 492.586) / 2, // Center horizontally: (container - heatSvg) / 2
    zIndex: 0,
  },
  potatoContainer: {
    position: 'absolute',
    top: (673 - 673) / 2, // Center vertically: potatoSvg fits perfectly
    left: (495 - 495.3) / 2, // Center horizontally: (container - potatoSvg) / 2
    zIndex: 1,
  },
})
