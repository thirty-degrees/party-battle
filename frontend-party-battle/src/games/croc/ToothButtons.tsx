import { TouchableOpacity, View } from 'react-native'
import CardSvgComponent from './cardSvgComponent'

type ToothButtonsProps = {
  teethCount: number
  pressedTeethIndex: number[]
  onToothPress: (toothIndex: number) => void
  disabled?: boolean
}

export default function ToothButtons({
  teethCount,
  pressedTeethIndex,
  onToothPress,
  disabled = false,
}: ToothButtonsProps) {
  return (
    <View className="w-full items-center px-4">
      <View className="flex-row justify-center mb-2 gap-1">
        {Array.from({ length: Math.min(6, teethCount) }, (_, index) => {
          const isPressed = pressedTeethIndex.includes(index)
          return (
            <TouchableOpacity
              key={index}
              onPress={isPressed || disabled ? undefined : () => onToothPress(index)}
              disabled={isPressed || disabled}
              style={{
                opacity: isPressed ? 0 : 1,
                width: '15%',
                aspectRatio: 0.7,
              }}
            >
              <CardSvgComponent />
            </TouchableOpacity>
          )
        })}
      </View>
      {teethCount > 6 && (
        <View className="flex-row justify-center gap-1">
          {Array.from({ length: Math.min(6, teethCount - 6) }, (_, index) => {
            const toothIndex = index + 6
            const isPressed = pressedTeethIndex.includes(toothIndex)
            return (
              <TouchableOpacity
                key={toothIndex}
                onPress={isPressed || disabled ? undefined : () => onToothPress(toothIndex)}
                disabled={isPressed || disabled}
                style={{
                  opacity: isPressed ? 0 : 1,
                  width: '15%',
                  aspectRatio: 0.7,
                }}
              >
                <CardSvgComponent />
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}
