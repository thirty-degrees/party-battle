import { View } from 'react-native'
import { PLAYER_COLORS } from 'types-party-battle/consts/config'

interface CellSnakeProps {
  player: string
  players: string[]
}

export const CellSnake = ({ player, players }: CellSnakeProps) => {
  const backgroundColor = PLAYER_COLORS[players.indexOf(player) % PLAYER_COLORS.length]

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor,
      }}
    />
  )
}
