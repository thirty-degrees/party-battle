import { useShallow } from 'zustand/react/shallow'
import { CellContent } from './CellContent'
import { useSnakeGameStore } from './useSnakeStore'

interface CellProps {
  index: number
  width: number
  cellSize: number
}

export const Cell = ({ index, width, cellSize }: CellProps) => {
  const cell = useSnakeGameStore(useShallow((state) => state.view.board[index]))

  const x = index % width
  const y = Math.floor(index / width)

  return (
    <CellContent
      style={{
        width: cellSize,
        height: cellSize,
        position: 'absolute',
        left: x * cellSize,
        top: y * cellSize,
      }}
      cell={cell}
    />
  )
}
