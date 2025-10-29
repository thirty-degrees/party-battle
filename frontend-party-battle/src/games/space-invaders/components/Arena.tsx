import { useCallback, useMemo, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import Svg, { Circle, Polygon, Rect } from 'react-native-svg'
import { useShallow } from 'zustand/react/shallow'
import { useSpaceInvadersStore } from '../useSpaceInvadersStore'

export function Arena() {
  const { width, height, ships, bullets, players } = useSpaceInvadersStore(
    useShallow((s) => ({
      width: s.view.width,
      height: s.view.height,
      ships: s.view.ships,
      bullets: s.view.bullets,
      players: s.view.players,
    }))
  )
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width)
    setContainerHeight(e.nativeEvent.layout.height)
  }, [])
  const scale = Math.min(containerWidth / Math.max(1, width), containerHeight / Math.max(1, height))
  const w = width * scale
  const h = height * scale

  const playerColorByName = useMemo(() => {
    const m = new Map<string, { r: number; g: number; b: number }>()
    players.forEach((p) => m.set(p.name, p.color))
    console.log(m)
    return m
  }, [players])

  return (
    <View className="flex-1 w-full items-center justify-center" onLayout={onLayout}>
      {containerWidth > 0 && containerHeight > 0 ? (
        <View className="items-center" style={{ width: w, height: h }}>
          <Svg width={w} height={h}>
            <Rect x={0} y={0} width={w} height={h} stroke="#6B7280" strokeWidth={4} fill="none" />
            {ships.map((s) => {
              const cx = s.x * scale
              const cy = s.y * scale
              const pointsUp = `${cx},${cy - 8} ${cx - 6},${cy + 6} ${cx + 6},${cy + 6}`
              const pointsRight = `${cx + 8},${cy} ${cx - 6},${cy - 6} ${cx - 6},${cy + 6}`
              const pointsDown = `${cx},${cy + 8} ${cx - 6},${cy - 6} ${cx + 6},${cy - 6}`
              const pointsLeft = `${cx - 8},${cy} ${cx + 6},${cy - 6} ${cx + 6},${cy + 6}`
              const p =
                s.heading === 'up'
                  ? pointsUp
                  : s.heading === 'right'
                    ? pointsRight
                    : s.heading === 'down'
                      ? pointsDown
                      : pointsLeft
              const c = playerColorByName.get(s.name)
              const fill = c ? `rgb(${c.r}, ${c.g}, ${c.b})` : '#ffffff'
              return <Polygon key={s.name} points={p} fill={fill} />
            })}
            {bullets.map((b, i) => (
              <Circle key={i} cx={b.x * scale} cy={b.y * scale} r={3} fill="#ff0000" />
            ))}
          </Svg>
        </View>
      ) : null}
    </View>
  )
}
