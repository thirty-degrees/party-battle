import { Direction, RemainingPlayer } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { getMovementIntentions, MovementIntention } from '../getMovementIntentions'

describe('getMovementIntentions', () => {
  describe('when there is 1 snake with length 2 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1' }]
    const bodies = new Map([['1', [3, 4]]])
    const directions = new Map<string, Direction>([['1', 'right']])
    const width = 3

    const intentions = getMovementIntentions(remainingPlayers, bodies, directions, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([
        { name: '1', head: { x: 2, y: 1 }, tail: 3, direction: 'right' },
      ])
    })
  })

  describe('when there is 1 snake with length 1 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1' }]
    const bodies = new Map([['1', [2]]])
    const directions = new Map<string, Direction>([['1', 'right']])
    const width = 2

    const intentions = getMovementIntentions(remainingPlayers, bodies, directions, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([
        { name: '1', head: { x: 1, y: 1 }, tail: 2, direction: 'right' },
      ])
    })
  })

  describe('when there are 2 snakes', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1' }, { name: '2' }]
    const bodies = new Map([
      ['1', [0]],
      ['2', [2]],
    ])
    const directions = new Map<string, Direction>([
      ['1', 'right'],
      ['2', 'down'],
    ])
    const width = 3

    const intentions = getMovementIntentions(remainingPlayers, bodies, directions, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([
        { name: '1', head: { x: 1, y: 0 }, tail: 0, direction: 'right' },
        { name: '2', head: { x: 2, y: 1 }, tail: 2, direction: 'down' },
      ])
    })
  })
})
