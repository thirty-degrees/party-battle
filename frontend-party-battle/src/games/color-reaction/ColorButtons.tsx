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
        className="w-[45%] aspect-[8/7] rounded-lg border-2"
      />
    )
  })

  return <View className="w-full flex-row flex-wrap justify-center gap-2">{buttons}</View>
}
