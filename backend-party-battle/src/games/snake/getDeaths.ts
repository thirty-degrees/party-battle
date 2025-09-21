import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { MovementIntention, Position } from './getIntentions'

export function getDeaths(
  intentions: MovementIntention[],
  board: Cell[],
  width: number,
  height: number
): Set<string> {
  const deaths = new Set<string>()

  for (const intention of intentions) {
    const nextIndex = intention.head.y * width + intention.head.x
    if (
      isOutOfBounds(intention.head, width, height) ||
      isCollisionWithOtherSnakes(intention.head, intentions) ||
      isCollisionWithSnakeBody(nextIndex, intentions, board)
    ) {
      deaths.add(intention.name)
    }
  }

  return deaths
}

function isOutOfBounds({ x, y }: Position, width: number, height: number): boolean {
  return x < 0 || x >= width || y < 0 || y >= height
}

function isCollisionWithOtherSnakes(head: Position, intentions: MovementIntention[]): boolean {
  return intentions.filter((n) => n.head.x === head.x && n.head.y === head.y).length > 1
}

function isCollisionWithSnakeBody(
  nextIndex: number,
  intentions: MovementIntention[],
  board: Cell[]
): boolean {
  const cell = board[nextIndex]
  const isTail = intentions.some((n) => n.tail === nextIndex)
  return cell.kind === CellKind.Snake && !isTail
}
