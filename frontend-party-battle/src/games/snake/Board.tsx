import { Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { GAME_VIEW_PADDING, MAX_GAME_WIDTH } from '../constants'

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

  const availableWidth = Math.min(screenWidth - left - right - GAME_VIEW_PADDING, MAX_GAME_WIDTH)
  const availableHeight = screenHeight - top - bottom - GAME_VIEW_PADDING

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
