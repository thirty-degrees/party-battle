import { View } from 'react-native'
import { CellContent } from './CellContent'

interface CellProps {
  index: number
  width: number
  cellSize: number
}

export const Cell = ({ index, width, cellSize }: CellProps) => {
  const x = index % width
  const y = Math.floor(index / width)

  return (
    <View
      style={{
        width: cellSize,
        height: cellSize,
        position: 'absolute',
        left: x * cellSize,
        top: y * cellSize,
      }}
    >
      <CellContent index={index} cellSize={cellSize} />
    </View>
  )
}
