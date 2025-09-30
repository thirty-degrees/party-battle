import { TouchableOpacity, View } from 'react-native'
import { RGBColor, rgbColorToString } from 'types-party-battle/types/RGBColorSchema'

interface ColorButtonsProps {
  colorButtons: RGBColor[]
  onButtonPress: (color: RGBColor, index: number) => void
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
        className="rounded-lg border-2 flex-1 w-full"
      />
    )
  })

  const renderButtonGroup = (buttonSlice: React.ReactNode[], startIndex: number) =>
    buttonSlice.map((button, index) => (
      <View key={startIndex + index} className="flex-1 w-full p-1">
        {button}
      </View>
    ))

  return (
    <View className="w-full flex-1 flex-row">
      <View className="w-1/2 flex-1 justify-center items-end">
        {renderButtonGroup(buttons.slice(0, 4), 0)}
      </View>
      <View className="w-1/2 flex-1 justify-center items-start">
        {renderButtonGroup(buttons.slice(4, 8), 4)}
      </View>
    </View>
  )
}
