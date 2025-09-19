import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'

export function createInitialBoard(playerNames: string[]): {
  board: Cell[]
  width: number
  height: number
  directions: Record<string, Direction>
  bodies: Map<string, number[]>
} {
  const width = 20
  const height = playerNames.length * 5
  const board: Cell[] = []
  const directions: Record<string, Direction> = {}
  const bodies = new Map<string, number[]>()

  for (let i = 0; i < width * height; i++) {
    board.push({ kind: CellKind.Empty })
  }

  playerNames.forEach((playerName, playerIndex) => {
    const y = 2 + playerIndex * 5
    const isEven = playerIndex % 2 === 0
    const xStart = isEven ? 0 : 16
    const xEnd = isEven ? 3 : 19
    const direction = isEven ? Direction.Right : Direction.Left

    directions[playerName] = direction

    const bodyIndices: number[] = []
    for (let x = xStart; x <= xEnd; x++) {
      const cellIndex = y * width + x
      board[cellIndex] = { kind: CellKind.Snake, player: playerName }
      bodyIndices.push(cellIndex)
    }
    if (direction === Direction.Left) {
      bodyIndices.reverse()
    }
    bodies.set(playerName, bodyIndices)
  })

  return { board, width, height, directions, bodies }
}
