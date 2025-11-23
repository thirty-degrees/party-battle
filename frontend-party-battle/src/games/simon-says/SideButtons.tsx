import { Button, ButtonText } from '@/components/ui/button'
import { View } from 'react-native'
import { SimonSide } from 'types-party-battle/types/simon-says/SimonSaysGameSchema'

type SideButtonsProps = {
  side: SimonSide | null | undefined
  onPress: (side: SimonSide) => void
  disabled: boolean
}

export function SideButtons({ side, onPress, disabled }: SideButtonsProps) {
  const isDisabled = disabled || side === null

  return (
    <View className="flex-row w-full gap-4 px-4 pb-4">
      <View className="flex-1">
        <Button
          size="xl"
          action="primary"
          onPress={() => onPress('left')}
          isDisabled={isDisabled}
          className="bg-blue-500 dark:bg-blue-600"
        >
          <ButtonText>LEFT</ButtonText>
        </Button>
      </View>
      <View className="flex-1">
        <Button
          size="xl"
          action="negative"
          onPress={() => onPress('right')}
          isDisabled={isDisabled}
          className="bg-red-500 dark:bg-red-600"
        >
          <ButtonText>RIGHT</ButtonText>
        </Button>
      </View>
    </View>
  )
}
