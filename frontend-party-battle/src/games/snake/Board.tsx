import { Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'

function getCellClassName(cellKind: CellKind): string {
  switch (cellKind) {
    case CellKind.Snake:
      return ' bg-green-500'
    case CellKind.Empty:
      return ' bg-gray-100 dark:bg-gray-800'
    case CellKind.Collectible:
      return ' bg-red-500'
  }
}

interface BoardProps {
  board: Cell[]
  width: number
  height: number
}

export const Board = ({ board, width, height }: BoardProps) => {
  const { top, bottom, left, right } = useSafeAreaInsets()
  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  // Calculate available space accounting for safe area insets and parent padding
  // BasicGameView: SafeAreaView with insets + p-2 (8px padding = 0.5rem on all sides = 16px total)
  // SnakeGame: pt-4 (16px = 1rem top padding)
  // BasicGameView: max-w-md (448px = 28rem) constraint
  const availableWidth = Math.min(screenWidth - left - right - 16, 448) // 16px for BasicGameView p-2
  const availableHeight = screenHeight - top - bottom - 16 // 16px for BasicGameView p-2

  const cellSize = Math.min(availableWidth / width, availableHeight / height)

  const boardWidth = cellSize * width
  const boardHeight = cellSize * height

  const renderCell = (cell: Cell, index: number) => {
    const x = index % width
    const y = Math.floor(index / width)

    const cellClassName = 'border border-gray-300' + getCellClassName(cell.kind)

    return (
      <View
        key={index}
        className={cellClassName}
        style={{
          width: cellSize,
          height: cellSize,
          position: 'absolute',
          left: x * cellSize,
          top: y * cellSize,
        }}
      />
    )
  }

  return (
    <View
      className="items-center"
      style={{
        width: boardWidth,
        height: boardHeight,
      }}
    >
      <View
        style={{
          width: boardWidth,
          height: boardHeight,
          position: 'relative',
        }}
      >
        {board.map(renderCell)}
      </View>
    </View>
  )
}
