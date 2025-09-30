import { View } from 'react-native'
import { rgbColorToString } from 'types-party-battle/types/RGBColorSchema'
import { useSnakeGameStore } from './useSnakeStore'

interface CellSnakeProps {
  playerName: string
}

export const CellSnake = ({ playerName }: CellSnakeProps) => {
  const backgroundColor = useSnakeGameStore((state) =>
    rgbColorToString(state.view.players.find((player) => player.name === playerName)!.color)
  )

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor,
      }}
    />
  )
}
