import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'

const DIRECTION_DELTA: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

export interface Position {
  x: number
  y: number
}

export interface MovementIntention {
  head: Position
  tail: number
  direction: Direction
}

export function getMovementIntention(
  body: number[],
  direction: Direction,
  boardWidth: number
): MovementIntention {
  const headIndex = body[body.length - 1]
  const x = headIndex % boardWidth
  const y = Math.floor(headIndex / boardWidth)
  const [dx, dy] = DIRECTION_DELTA[direction]
  const nx = x + dx
  const ny = y + dy

  return { head: { x: nx, y: ny }, tail: body[0], direction }
}
