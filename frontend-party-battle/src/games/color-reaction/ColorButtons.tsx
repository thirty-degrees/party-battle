import { TouchableOpacity, View } from 'react-native'
import { RGBColorSchema, rgbColorToString } from 'types-party-battle/types/RGBColorSchema'

interface ColorButtonsProps {
  colorButtons: RGBColorSchema[]
  onButtonPress: (color: RGBColorSchema, index: number) => void
}

export const ColorButtons = ({ colorButtons, onButtonPress }: ColorButtonsProps) => {
  if (!colorButtons || colorButtons.length === 0) {
    return null
  }

  const buttons = colorButtons.map((colorButton, colorIndex) => {
    const colorString = rgbColorToString(colorButton)
    const transparentColor = colorString.replace('rgb', 'rgba').replace(')', ', 0.2)')

    return (
      <TouchableOpacity
        key={colorIndex}
        onPress={() => onButtonPress(colorButton, colorIndex)}
        style={{
          backgroundColor: transparentColor,
          borderColor: colorString,
        }}
        className="rounded-lg border-2 flex-1 aspect-square"
      />
    )
  })

  return (
    <View className="w-full flex-1 flex-row">
      <View className="w-1/2 flex-1 flex-col justify-center">
        {buttons.slice(0, 4).map((button, index) => (
          <View key={index} className="flex-1 p-1">
            {button}
          </View>
        ))}
      </View>
      <View className="w-1/2 flex-1 flex-col justify-center">
        {buttons.slice(4, 8).map((button, index) => (
          <View key={index + 4} className="flex-1 p-1">
            {button}
          </View>
        ))}
      </View>
    </View>
  )
}
