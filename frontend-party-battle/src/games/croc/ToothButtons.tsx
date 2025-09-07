import { View } from 'react-native'
import { Button, ButtonText } from '../../../components/ui/button'

type ToothButtonsProps = {
  teethCount: number
  pressedTeethIndex: number[]
  onToothPress: (toothIndex: number) => void
}

export default function ToothButtons({ teethCount, pressedTeethIndex, onToothPress }: ToothButtonsProps) {
  return (
    <View className="w-80">
      <View className="flex-row justify-center gap-2 mb-2">
        {Array.from({ length: Math.min(6, teethCount) }, (_, index) => {
          const isPressed = pressedTeethIndex.includes(index)
          return (
            <Button
              key={index}
              size="sm"
              action="primary"
              variant="solid"
              isDisabled={isPressed}
              onPress={isPressed ? undefined : () => onToothPress(index)}
            >
              <ButtonText></ButtonText>
            </Button>
          )
        })}
      </View>
      {teethCount > 6 && (
        <View className="flex-row justify-center gap-2">
          {Array.from({ length: Math.min(6, teethCount - 6) }, (_, index) => {
            const toothIndex = index + 6
            const isPressed = pressedTeethIndex.includes(toothIndex)
            return (
              <Button
                key={toothIndex}
                size="sm"
                action="primary"
                variant="solid"
                isDisabled={isPressed}
                onPress={isPressed ? undefined : () => onToothPress(toothIndex)}
              >
                <ButtonText></ButtonText>
              </Button>
            )
          })}
        </View>
      )}
    </View>
  )
}
