import { View } from 'react-native'
import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import useBasicGameViewDimensions from '../useBasicGameViewDimensions'

function getCellClassName(cellKind: CellKind): string {
  switch (cellKind) {
    case CellKind.Snake:
      return ' bg-green-500'
    case CellKind.Empty:
      return ' bg-zinc-800'
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
  const { availableWidth, availableHeight } = useBasicGameViewDimensions()

  const cellSize = Math.min(availableWidth / width, availableHeight / height)

  const boardWidth = cellSize * width
  const boardHeight = cellSize * height

  const renderCell = (cell: Cell, index: number) => {
    const x = index % width
    const y = Math.floor(index / width)

    const cellClassName = getCellClassName(cell.kind)

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
