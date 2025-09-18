import { View } from 'react-native'
import { Player } from 'types-party-battle/types/PlayerSchema'
import { Cell } from 'types-party-battle/types/snake/CellSchema'
import useBasicGameViewDimensions from '../useBasicGameViewDimensions'
import { CellContent } from './CellContent'

interface BoardProps {
  board: Cell[]
  width: number
  height: number
  players: Player[]
}

export const Board = ({ board, width, height, players }: BoardProps) => {
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
        <CellContent cell={cell} players={players} />
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
