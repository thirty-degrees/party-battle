import { createInitialBoard } from '../createInitialBoard'

describe('createInitialBoard', () => {
  describe('when there are 2 players', () => {
    it('should create a board with correct dimensions', () => {
      const players = ['player1', 'player2']

      const result = createInitialBoard(players)

      expect(result.width).toBe(20)
      expect(result.height).toBe(10)
      expect(result.board).toHaveLength(20 * 10)
    })
  })

  describe('when there are 8 players', () => {
    it('should create a board with correct dimensions', () => {
      const players = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8']

      const result = createInitialBoard(players)

      expect(result.width).toBe(20)
      expect(result.height).toBe(40)
      expect(result.board).toHaveLength(20 * 40)
    })
  })
})
