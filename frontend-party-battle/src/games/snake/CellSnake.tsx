import { View } from 'react-native'
import { Player } from 'types-party-battle/types/PlayerSchema'
import { rgbColorToString } from 'types-party-battle/types/RGBColorSchema'

interface CellSnakeProps {
  player: Player
}

export const CellSnake = ({ player }: CellSnakeProps) => {
  const backgroundColor = rgbColorToString(player.color)

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor,
      }}
    />
  )
}
