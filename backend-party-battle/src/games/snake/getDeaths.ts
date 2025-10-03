import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { MovementIntention, Position } from './getMovementIntention'

export function getDeaths(
  intentions: Record<string, MovementIntention>,
  board: Cell[],
  width: number,
  height: number
): Set<string> {
  const values = Object.values(intentions)

  return new Set(
    Object.entries(intentions)
      .filter(([, intention]) => isDead(intention, values, board, width, height))
      .map(([playerName]) => playerName)
  )
}

function isDead(
  intention: MovementIntention,
  intentions: MovementIntention[],
  board: Cell[],
  width: number,
  height: number
): boolean {
  if (isOutOfBounds(intention.head, width, height)) {
    return true
  }
  if (isCollisionWithOtherSnakes(intention.head, intentions)) {
    return true
  }
  if (isCollisionWithSnakeBody(intention.head, intentions, board, width)) {
    return true
  }
  return false
}

function isOutOfBounds({ x, y }: Position, width: number, height: number): boolean {
  return x < 0 || x >= width || y < 0 || y >= height
}

function isCollisionWithOtherSnakes(head: Position, intentions: MovementIntention[]): boolean {
  return intentions.filter((n) => n.head.x === head.x && n.head.y === head.y).length > 1
}

function isCollisionWithSnakeBody(
  head: Position,
  intentions: MovementIntention[],
  board: Cell[],
  width: number
): boolean {
  const nextIndex = head.y * width + head.x
  const cell = board[nextIndex]
  const isTail = intentions.some((n) => n.tail === nextIndex)
  return cell.kind === CellKind.Snake && !isTail
}
