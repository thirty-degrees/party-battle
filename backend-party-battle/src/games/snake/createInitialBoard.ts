import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'

export function createInitialBoard(playerNames: string[]): {
  board: Cell[]
  width: number
  height: number
} {
  const width = 20
  const height = playerNames.length * 5
  const board: Cell[] = []

  for (let i = 0; i < width * height; i++) {
    board.push({ kind: CellKind.Empty })
  }

  playerNames.forEach((playerName, playerIndex) => {
    const y = 2 + playerIndex * 5
    const isEven = playerIndex % 2 === 0
    const xStart = isEven ? 0 : 16
    const xEnd = isEven ? 3 : 19

    for (let x = xStart; x <= xEnd; x++) {
      const cellIndex = y * width + x
      board[cellIndex] = { kind: CellKind.Snake, player: playerName }
    }
  })

  return { board, width, height }
}
