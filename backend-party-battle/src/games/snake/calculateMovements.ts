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
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      deaths.add(rp.name)
      continue
    }
    const nextIndex = ny * width + nx
    const isOwnTail = nextIndex === body[0]
    const cell = board[nextIndex]
    if (cell.kind === CellKind.Snake && !isOwnTail) {
      deaths.add(rp.name)
      continue
    }
    intentions.push({ name: rp.name, next: nextIndex, tail: body[0] })
  }

  const targets = new Map<number, string[]>()
  for (const i of intentions) {
    const arr = targets.get(i.next)
    if (arr) arr.push(i.name)
    else targets.set(i.next, [i.name])
  }

  for (const [idx, names] of targets) {
    if (names.length >= 2 && board[idx].kind === CellKind.Empty) {
      for (const n of names) deaths.add(n)
    }
  }

  return { intentions, deaths }
}
