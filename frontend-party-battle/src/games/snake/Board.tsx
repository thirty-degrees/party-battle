import { View } from 'react-native'
import { Cell } from 'types-party-battle/types/snake/CellSchema'
import { useShallow } from 'zustand/react/shallow'
import useBasicGameViewDimensions from '../useBasicGameViewDimensions'
import { CellContent } from './CellContent'
import { useSnakeGameStore } from './useSnakeStore'

export const Board = () => {
  const { board, width, height } = useSnakeGameStore(
    useShallow((state) => ({
      board: state.view.board,
      width: state.view.width,
      height: state.view.height,
    }))
  )
  const { availableWidth, availableHeight } = useBasicGameViewDimensions()

  const cellSize = Math.min(availableWidth / width, availableHeight / height)

  const boardWidth = cellSize * width
  const boardHeight = cellSize * height

  const renderCell = (cell: Cell, index: number) => {
    const x = index % width
    const y = Math.floor(index / width)

    return (
      <View
        key={index}
        style={{
          width: cellSize,
          height: cellSize,
          position: 'absolute',
          left: x * cellSize,
          top: y * cellSize,
        }}
      >
        <CellContent cell={cell} />
      </View>
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
