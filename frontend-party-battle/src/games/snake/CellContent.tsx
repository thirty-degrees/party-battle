import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { CellCollectible } from './CellCollectible'
import { CellEmpty } from './CellEmpty'
import { CellSnake } from './CellSnake'

interface CellContentProps {
  cell: Cell
}

export const CellContent = ({ cell }: CellContentProps) => {
  switch (cell.kind) {
    case CellKind.Snake:
      return <CellSnake playerName={cell.player!} />
    case CellKind.Empty:
      return <CellEmpty />
    case CellKind.Collectible:
      return <CellCollectible />
  }
}
