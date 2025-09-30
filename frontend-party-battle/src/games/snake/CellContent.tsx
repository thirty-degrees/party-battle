import { CellKind } from 'types-party-battle/types/snake/CellSchema'
import { useShallow } from 'zustand/react/shallow'
import { CellCollectible } from './CellCollectible'
import { CellEmpty } from './CellEmpty'
import { CellSnake } from './CellSnake'
import { useSnakeGameStore } from './useSnakeStore'

interface CellContentProps {
  index: number
  cellSize: number
}

export const CellContent = ({ index, cellSize }: CellContentProps) => {
  const cell = useSnakeGameStore(useShallow((state) => state.view.board[index]))

  switch (cell.kind) {
    case CellKind.Snake:
      return <CellSnake playerName={cell.player!} cellSize={cellSize} isHead={cell.isHead} />
    case CellKind.Empty:
      return <CellEmpty />
    case CellKind.Collectible:
      return <CellCollectible />
  }
}
