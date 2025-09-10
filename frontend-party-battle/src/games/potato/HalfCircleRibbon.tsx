
export type ArcItem = { id: string; element: ReactNode }
type Props = {
  radius: number
  itemSize: number
  items: ArcItem[]
  centerItem: ReactNode
}

export default function HalfCircleRibbon({ radius, itemSize, items, centerItem }: Props) {
  const degrees = [150, 120, 90, 60, 30]
  return (
    <View className="w-full items-center">
      <View
        className="relative overflow-visible"
        style={{ width: 2 * radius, height: radius + itemSize / 2 }}
      >
        {items.map((it, i) => {
          const a = (degrees[i] * Math.PI) / 180
          const x = radius + (radius - itemSize / 2) * Math.cos(a) - itemSize / 2
          const y = radius - (radius - itemSize / 2) * Math.sin(a) - itemSize / 2
          const rotate = -(degrees[i] - 90) + 'deg'
          return (
            <View
              key={it.id}
              className="absolute"
              style={{
                height: itemSize,
                left: x,
                top: y,
                transform: [{ rotate }],
              }}
            >
              <View className="flex-1 items-center justify-center p-2">{it.element}</View>
            </View>
          )
        })}
        <View
          className="absolute items-center justify-center"
          style={{
            width: 2 * itemSize,
            height: itemSize,
            left: radius - itemSize,
            top: radius - itemSize / 2,
          }}
        >
          {centerItem}
        </View>
      </View>
    </View>
  )
}
