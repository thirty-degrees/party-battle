import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { Direction, RemainingPlayer } from 'types-party-battle/types/snake/RemainingPlayerSchema'

export interface MovementIntention {
  name: string
  next: number
  tail: number
}

export interface MovementResult {
  intentions: MovementIntention[]
  deaths: Set<string>
}

export function calculateMovements(
  remainingPlayers: RemainingPlayer[],
  bodies: Map<string, number[]>,
  board: Cell[],
  width: number,
  height: number
): MovementResult {
  const intentions: MovementIntention[] = []
  const deaths = new Set<string>()

  const dxdy = (d: Direction): [number, number] => {
    if (d === Direction.Up) return [0, -1]
    if (d === Direction.Down) return [0, 1]
    if (d === Direction.Left) return [-1, 0]
    return [1, 0]
  }

  for (const rp of remainingPlayers) {
    const body = bodies.get(rp.name)

    const headIndex = body[body.length - 1]
    const x = headIndex % width
    const y = Math.floor(headIndex / width)
    const [dx, dy] = dxdy(rp.direction)
    const nx = x + dx
    const ny = y + dy
    const nextIndex = ny * width + nx

    intentions.push({ name: rp.name, next: nextIndex, tail: body[0] })
  }

  for (const intention of intentions) {
    const nextIndex = intention.next
    if (
      isOutOfBounds(nextIndex, width, height) ||
      isCollisionWithOtherSnakes(nextIndex, intentions) ||
      isCollisionWithSnakeBody(nextIndex, intentions, board)
    ) {
      deaths.add(intention.name)
    }
  }

  const aliveIntentions = intentions.filter((intention) => !deaths.has(intention.name))

  return { intentions: aliveIntentions, deaths }
}

function isOutOfBounds(nextIndex: number, width: number, height: number): boolean {
  const nx = nextIndex % width
  const ny = Math.floor(nextIndex / width)
  return nx < 0 || nx >= width || ny < 0 || ny >= height
}

function isCollisionWithOtherSnakes(nextIndex: number, intentions: MovementIntention[]): boolean {
  return intentions.filter((n) => n.next === nextIndex).length > 1
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
