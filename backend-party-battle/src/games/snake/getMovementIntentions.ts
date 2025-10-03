import { Direction, RemainingPlayer } from 'types-party-battle/types/snake/RemainingPlayerSchema'

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
  name: string
  head: Position
  tail: number
  direction: Direction
}

export function getMovementIntentions(
  players: RemainingPlayer[],
  bodies: Map<string, number[]>,
  directions: Map<string, Direction>,
  boardWidth: number
): MovementIntention[] {
  const intentions: MovementIntention[] = []

  for (const player of players) {
    const body = bodies.get(player.name)
    const direction = directions.get(player.name)

    const headIndex = body[body.length - 1]
    const x = headIndex % boardWidth
    const y = Math.floor(headIndex / boardWidth)
    const [dx, dy] = DIRECTION_DELTA[direction]
    const nx = x + dx
    const ny = y + dy

    intentions.push({ name: player.name, head: { x: nx, y: ny }, tail: body[0], direction })
  }

  return intentions
}
