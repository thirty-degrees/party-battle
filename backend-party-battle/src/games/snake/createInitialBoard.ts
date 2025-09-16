import { Cell, CellKind } from 'types-party-battle/types/snake/Cell'

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

  return { board, width, height }
}
