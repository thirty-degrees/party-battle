import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { CellCollectible } from './CellCollectible'
import { CellEmpty } from './CellEmpty'
import { CellSnake } from './CellSnake'

interface CellContentProps {
  cell: Cell
  players: string[]
}

export const CellContent = ({ cell, players }: CellContentProps) => {
  switch (cell.kind) {
    case CellKind.Snake:
      return <CellSnake player={cell.player!} players={players} />
    case CellKind.Empty:
      return <CellEmpty />
    case CellKind.Collectible:
      return <CellCollectible />
  }
}
