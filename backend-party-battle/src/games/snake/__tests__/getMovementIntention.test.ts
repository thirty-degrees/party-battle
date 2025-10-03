import { Direction } from 'types-party-battle/types/snake/DirectionSchema'
import { getMovementIntention, MovementIntention } from '../getMovementIntention'

describe('getMovementIntention', () => {
  describe('when snake with length 3 moves right', () => {
    const body = [0, 3, 4]
    const direction: Direction = 'right'
    const width = 3

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 2, y: 1 },
        tail: 0,
        direction: 'right',
      })
    })
  })

  describe('when snake with length 1 moves right', () => {
    const body = [2]
    const direction: Direction = 'right'
    const width = 2

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 1, y: 1 },
        tail: 2,
        direction: 'right',
      })
    })
  })

  describe('when snake moves out of the map right', () => {
    const body = [3]
    const direction: Direction = 'right'
    const width = 2

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 2, y: 1 },
        tail: 3,
        direction: 'right',
      })
    })
  })

  describe('when snake moves down', () => {
    const body = [2, 5]
    const direction: Direction = 'down'
    const width = 3

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 2, y: 2 },
        tail: 2,
        direction: 'down',
      })
    })
  })

  describe('when snake moves left', () => {
    const body = [2, 5]
    const direction: Direction = 'left'
    const width = 3

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 1, y: 1 },
        tail: 2,
        direction: 'left',
      })
    })
  })

  describe('when snake moves up', () => {
    const body = [4, 2]
    const direction: Direction = 'up'
    const width = 2

    const intention = getMovementIntention(body, direction, width)

    it('should create correct intention', () => {
      expect(intention).toEqual<MovementIntention>({
        head: { x: 0, y: 0 },
        tail: 4,
        direction: 'up',
      })
    })
  })
})
