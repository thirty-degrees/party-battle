import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { Direction } from 'types-party-battle/types/snake/DirectionSchema'

export function createInitialBoard(playerNames: string[]): {
  board: Cell[]
  width: number
  height: number
  directions: Record<string, Direction>
  bodies: Record<string, number[]>
} {
  const width = 20
  const height = playerNames.length * 5
  const board: Cell[] = []
  const directions: Record<string, Direction> = {}
  const bodies: Record<string, number[]> = {}

  for (let i = 0; i < width * height; i++) {
    board.push({ kind: CellKind.Empty })
  }

  playerNames.forEach((playerName, playerIndex) => {
    const y = 2 + playerIndex * 5
    const isEven = playerIndex % 2 === 0
    const xStart = isEven ? 0 : 16
    const xEnd = isEven ? 3 : 19
    const direction = isEven ? 'right' : 'left'

    directions[playerName] = direction

    const bodyIndices: number[] = []
    for (let x = xStart; x <= xEnd; x++) {
      const cellIndex = y * width + x
      const isHead = (direction === 'right' && x === xEnd) || (direction === 'left' && x === xStart)
      board[cellIndex] = { kind: CellKind.Snake, player: playerName, isHead }
      bodyIndices.push(cellIndex)
    }
    if (direction === 'left') {
      bodyIndices.reverse()
    }
    bodies[playerName] = bodyIndices
  })

  return { board, width, height, directions, bodies }
}
