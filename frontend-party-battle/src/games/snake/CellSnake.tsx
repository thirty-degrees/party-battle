import { Platform, View } from 'react-native'
import { rgbColorToString } from 'types-party-battle/types/RGBColorSchema'
import { Text } from '../../../components/ui/text'
import { useSnakeGameStore } from './useSnakeStore'

interface CellSnakeProps {
  playerName: string
  cellSize: number
  isHead?: boolean
}

export const CellSnake = ({ playerName, cellSize, isHead }: CellSnakeProps) => {
  const backgroundColor = useSnakeGameStore((state) =>
    rgbColorToString(state.view.players.find((player) => player.name === playerName)!.color)
  )

  return (
    <View className="flex-1">
      {isHead && (
        <View
          className="absolute z-10"
          style={{
            top: -cellSize * 0.8,
            left: -cellSize * 2.5,
            width: cellSize * 6,
            ...(Platform.OS === 'web' ? { userSelect: 'none' } : {}),
          }}
        >
          <Text className="text-center text-white font-normal text-2xs">{playerName}</Text>
        </View>
      )}
      <View
        className="flex-1"
        style={{
          backgroundColor,
        }}
      />
    </View>
  )
}
