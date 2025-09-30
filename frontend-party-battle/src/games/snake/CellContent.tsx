import { View, ViewProps } from 'react-native'
import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { CellCollectible } from './CellCollectible'
import { CellEmpty } from './CellEmpty'
import { CellSnake } from './CellSnake'

interface CellContentProps extends ViewProps {
  cell: Cell
}

export const CellContent = ({ cell, style }: CellContentProps) => {
  return (
    <View style={style}>
      {cell.kind === CellKind.Snake ? (
        <CellSnake playerName={cell.player!} />
      ) : cell.kind === CellKind.Empty ? (
        <CellEmpty />
      ) : (
        <CellCollectible />
      )}
    </View>
  )
}
