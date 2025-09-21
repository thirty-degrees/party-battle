import { Direction, RemainingPlayer } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { getIntentions, MovementIntention } from '../getIntentions'

describe('getIntentions', () => {
  describe('when there is 1 snake with length 2 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [3, 4]]])
    const width = 3

    const intentions = getIntentions(remainingPlayers, bodies, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([{ name: '1', head: { x: 2, y: 1 }, tail: 3 }])
    })
  })

  describe('when there is 1 snake with length 1 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [2]]])
    const width = 2

    const intentions = getIntentions(remainingPlayers, bodies, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([{ name: '1', head: { x: 1, y: 1 }, tail: 2 }])
    })
  })

  describe('when there are 2 snakes', () => {
    const remainingPlayers: RemainingPlayer[] = [
      { name: '1', direction: Direction.Right },
      { name: '2', direction: Direction.Down },
    ]
    const bodies = new Map([
      ['1', [0]],
      ['2', [2]],
    ])
    const width = 3

    const intentions = getIntentions(remainingPlayers, bodies, width)

    it('should create correct intentions', () => {
      expect(intentions).toEqual<MovementIntention[]>([
        { name: '1', head: { x: 1, y: 0 }, tail: 0 },
        { name: '2', head: { x: 2, y: 1 }, tail: 2 },
      ])
    })
  })
})
