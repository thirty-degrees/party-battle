import { assignPlayerSlots } from '../assignPlayerSlots'

describe('assignPlayerSlots', () => {
  describe('when one opponent', () => {
    it('should assign the single opponent to the top slot when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        top: 'player2',
      })
    })

    it('should assign the single opponent to the top slot when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        top: 'player1',
      })
    })
  })

  describe('when two opponents', () => {
    it('should assign the two opponents to the left and right slots when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        left: 'player3',
      })
    })

    it('should assign the two opponents to the left and right slots when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        left: 'player1',
      })
    })

    it('should assign the two opponents to the left and right slots when current player is the third player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3']
      const currentPlayer = 'player3'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        left: 'player2',
      })
    })
  })

  describe('when three opponents', () => {
    it('should assign the three opponents to the left, right, and top slots when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        top: 'player3',
        left: 'player4',
      })
    })

    it('should assign the three opponents to the left, right, and top slots when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        top: 'player4',
        left: 'player1',
      })
    })

    it('should assign the three opponents to the left, right, and top slots when current player is the fourth player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4']
      const currentPlayer = 'player4'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        top: 'player2',
        left: 'player3',
      })
    })
  })

  describe('when four opponents', () => {
    it('should assign the four opponents to the left, right, top, and topRight slots when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        topRight: 'player3',
        top: 'player4',
        left: 'player5',
      })
    })

    it('should assign the four opponents to the left, right, top, and topRight slots when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        topRight: 'player4',
        top: 'player5',
        left: 'player1',
      })
    })

    it('should assign the four opponents to the left, right, top, and topRight slots when current player is the fifth player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5']
      const currentPlayer = 'player5'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        topRight: 'player2',
        top: 'player3',
        left: 'player4',
      })
    })
  })

  describe('when five opponents', () => {
    it('should assign the five opponents to the left, right, top, topRight, and topLeft slots when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        topRight: 'player3',
        top: 'player4',
        topLeft: 'player5',
        left: 'player6',
      })
    })

    it('should assign the five opponents to the left, right, top, topRight, and topLeft slots when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        topRight: 'player4',
        top: 'player5',
        topLeft: 'player6',
        left: 'player1',
      })
    })

    it('should assign the five opponents to the left, right, top, topRight, and topLeft slots when current player is the sixth player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6']
      const currentPlayer = 'player6'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        topRight: 'player2',
        top: 'player3',
        topLeft: 'player4',
        left: 'player5',
      })
    })
  })

  describe('when six opponents', () => {
    it('should assign the six opponents to the left, right, top, topRight, topLeft, and topCenterRight slots when current player is the first player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7']
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        topRight: 'player3',
        topCenterRight: 'player4',
        top: 'player5',
        topLeft: 'player6',
        left: 'player7',
      })
    })

    it('should assign the six opponents to the left, right, top, topRight, topLeft, and topCenterRight slots when current player is the second player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7']
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        topRight: 'player4',
        topCenterRight: 'player5',
        top: 'player6',
        topLeft: 'player7',
        left: 'player1',
      })
    })

    it('should assign the six opponents to the left, right, top, topRight, topLeft, and topCenterRight slots when current player is the seventh player', () => {
      const remainingPlayers = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7']
      const currentPlayer = 'player7'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        topRight: 'player2',
        topCenterRight: 'player3',
        top: 'player4',
        topLeft: 'player5',
        left: 'player6',
      })
    })
  })

  describe('when seven opponents', () => {
    it('should assign the seven opponents to the left, right, top, topRight, topLeft, topCenterRight, and topCenterLeft slots when current player is the first player', () => {
      const remainingPlayers = [
        'player1',
        'player2',
        'player3',
        'player4',
        'player5',
        'player6',
        'player7',
        'player8',
      ]
      const currentPlayer = 'player1'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player2',
        topRight: 'player3',
        topCenterRight: 'player4',
        top: 'player5',
        topCenterLeft: 'player6',
        topLeft: 'player7',
        left: 'player8',
      })
    })

    it('should assign the seven opponents to the left, right, top, topRight, topLeft, topCenterRight, and topCenterLeft slots when current player is the second player', () => {
      const remainingPlayers = [
        'player1',
        'player2',
        'player3',
        'player4',
        'player5',
        'player6',
        'player7',
        'player8',
      ]
      const currentPlayer = 'player2'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player3',
        topRight: 'player4',
        topCenterRight: 'player5',
        top: 'player6',
        topCenterLeft: 'player7',
        topLeft: 'player8',
        left: 'player1',
      })
    })

    it('should assign the seven opponents to the left, right, top, topRight, topLeft, topCenterRight, and topCenterLeft slots when current player is the eighth player', () => {
      const remainingPlayers = [
        'player1',
        'player2',
        'player3',
        'player4',
        'player5',
        'player6',
        'player7',
        'player8',
      ]
      const currentPlayer = 'player8'
      const result = assignPlayerSlots(remainingPlayers, currentPlayer)

      expect(result).toEqual({
        right: 'player1',
        topRight: 'player2',
        topCenterRight: 'player3',
        top: 'player4',
        topCenterLeft: 'player5',
        topLeft: 'player6',
        left: 'player7',
      })
    })
  })
})
