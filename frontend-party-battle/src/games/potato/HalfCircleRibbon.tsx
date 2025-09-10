import { Text, View } from 'react-native';

type ArcItem = { id: string; label: string }
type Props = {
  radius: number
  itemSize: number
  items: ArcItem[]
}

export default function HalfCircleRibbon({ radius, itemSize, items }: Props) {
  const degrees = [150, 120, 90, 60, 30]
  return (
    <View className="w-full items-center">
      <View className="relative overflow-visible" style={{ width: 2 * radius, height: radius + itemSize }}>
        {items.map((it, i) => {
          const a = (degrees[i] * Math.PI) / 180
          const x = radius + (radius - itemSize / 2) * Math.cos(a) - itemSize / 2
          const y = radius - (radius - itemSize / 2) * Math.sin(a) - itemSize / 2
          const rotate = -(degrees[i] - 90) + 'deg'
          return (
            <View
              key={it.id}
              className="absolute rounded-xl border-2 border-black bg-yellow-100"
              style={{
                width: itemSize,
                height: itemSize,
                left: x,
                top: y,
                transform: [{ rotate }],
              }}
            >
              <View className="flex-1 items-center justify-center p-2">
                <Text className="text-center text-xl font-bold">{it.label}</Text>
              </View>
            </View>
          )
        })}
        <View
          className="absolute rounded-xl border-2 border-black bg-blue-200 items-center justify-center"
          style={{
            width: itemSize,
            height: itemSize,
            left: radius - itemSize / 2,
            top: radius - itemSize / 2,
          }}
        >
          <Text className="text-3xl font-bold">text</Text>
        </View>
      </View>
    </View>
  )
}
