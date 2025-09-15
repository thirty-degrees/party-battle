import { getPlayerLeftOf } from '../getPlayerLeftOf'

describe('getPlayerLeftOf', () => {
  describe('when currentPlayer is in the players array', () => {
    it('should return the player to the left in a circular array', () => {
      const players = ['player0', 'player1', 'player2']
      const currentPlayer = 'player1'

      const result = getPlayerLeftOf(players, currentPlayer)

      expect(result).toBe('player0')
    })
  })

  describe('when currentPlayer is the first player', () => {
    it('should return the last player (circular)', () => {
      const players = ['player0', 'player1', 'player2']
      const currentPlayer = 'player0'

      const result = getPlayerLeftOf(players, currentPlayer)

      expect(result).toBe('player2')
    })
  })

  describe('when currentPlayer is the only player', () => {
    it('should return null', () => {
      const players = ['player0']
      const currentPlayer = 'player0'

      const result = getPlayerLeftOf(players, currentPlayer)

      expect(result).toBe(null)
    })
  })

  describe('when there are 2 players', () => {
    it('should return null (no left player, other player is across)', () => {
      const players = ['player0', 'player1']
      const currentPlayer = 'player0'

      const result = getPlayerLeftOf(players, currentPlayer)

      expect(result).toBe(null)
    })
  })

  describe('when currentPlayer is not in the players array', () => {
    it('should throw an error', () => {
      const players = ['player0', 'player1', 'player2']
      const currentPlayer = 'player3'

      expect(() => getPlayerLeftOf(players, currentPlayer)).toThrow(
        'Current player must be in the players array'
      )
    })
  })

  describe('when players array is empty', () => {
    it('should throw an error', () => {
      const players: string[] = []
      const currentPlayer = 'player0'

      expect(() => getPlayerLeftOf(players, currentPlayer)).toThrow(
        'Current player must be in the players array'
      )
    })
  })
})
