import { useShallow } from 'zustand/react/shallow'
import { View } from 'react-native'
import Svg, { Polygon, Circle } from 'react-native-svg'
import useBasicGameViewDimensions from '../../useBasicGameViewDimensions'
import { useSpaceInvadersStore } from '../useSpaceInvadersStore'

export function Arena() {
  const { width, height, ships, bullets } = useSpaceInvadersStore(
    useShallow((state) => ({
      width: state.view.width,
      height: state.view.height,
      ships: state.view.ships,
      bullets: state.view.bullets,
    }))
  )
  const { availableWidth, availableHeight } = useBasicGameViewDimensions()
  const scale = Math.min(availableWidth / Math.max(1, width), availableHeight / Math.max(1, height))
  const displayWidth = width * scale
  const displayHeight = height * scale
  return (
    <View className="items-center" style={{ width: displayWidth, height: displayHeight }}>
      <Svg width={displayWidth} height={displayHeight}>
        {ships.map((ship) => {
          const cx = ship.x * scale
          const cy = ship.y * scale
          const pointsUp = `${cx},${cy - 8} ${cx - 6},${cy + 6} ${cx + 6},${cy + 6}`
          const pointsRight = `${cx + 8},${cy} ${cx - 6},${cy - 6} ${cx - 6},${cy + 6}`
          const pointsDown = `${cx},${cy + 8} ${cx - 6},${cy - 6} ${cx + 6},${cy - 6}`
          const pointsLeft = `${cx - 8},${cy} ${cx + 6},${cy - 6} ${cx + 6},${cy + 6}`
          const points =
            ship.heading === 'up'
              ? pointsUp
              : ship.heading === 'right'
              ? pointsRight
              : ship.heading === 'down'
              ? pointsDown
              : pointsLeft
          return <Polygon key={ship.name} points={points} fill="#fff" />
        })}
        {bullets.map((bullet, index) => (
          <Circle key={index} cx={bullet.x * scale} cy={bullet.y * scale} r={3} fill="#f00" />
        ))}
      </Svg>
    </View>
  )
}
