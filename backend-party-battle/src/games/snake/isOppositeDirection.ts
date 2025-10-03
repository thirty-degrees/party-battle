import { Direction } from 'types-party-battle/types/snake/DirectionSchema'

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  if (current === 'up' && next === 'down') {
    return true
  }
  if (current === 'down' && next === 'up') {
    return true
  }
  if (current === 'left' && next === 'right') {
    return true
  }
  if (current === 'right' && next === 'left') {
    return true
  }
  return false
}
