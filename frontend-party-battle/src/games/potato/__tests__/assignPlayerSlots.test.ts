import { assignPlayerSlots } from '../assignPlayerSlots'

describe('assignPlayerSlots', () => {
  describe('when opponents.length === 1', () => {
    it('should assign the single opponent to the top slot', () => {
      const remainingPlayers = ['player1', 'player2']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        top: 'player2',
      })
    })
  })
})
