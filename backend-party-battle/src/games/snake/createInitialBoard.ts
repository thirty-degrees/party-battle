import { ArraySchema } from '@colyseus/schema'
import { Cell } from 'types-party-battle/types/snake/Cell'

export function createInitialBoard(playerNames: string[]) {
  const width = 20
  const height = playerNames.length * 5
  const board = new ArraySchema<Cell>()

  return { board, width, height }
}
