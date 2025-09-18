import { View } from 'react-native'
import { Player } from 'types-party-battle/types/PlayerSchema'

interface CellSnakeProps {
  player: Player
}

export const CellSnake = ({ player }: CellSnakeProps) => {
  const backgroundColor = player.color

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor,
      }}
    />
  )
}
