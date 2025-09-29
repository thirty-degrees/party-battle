import { assignScoresByRank } from '../assignScoresByRank'

describe('assignScoresByRank', () => {
  describe('with multiple players in different ranks', () => {
    it('should assign scores based on rank groups', () => {
      const players = [['Alice'], ['Bob'], ['Charlie']]

      const result = assignScoresByRank(players)

      expect(result.length).toBe(3)
      expect(result).toEqual([
        { playerName: 'Alice', value: 2 },
        { playerName: 'Bob', value: 1 },
        { playerName: 'Charlie', value: 0 },
      ])
    })
  })

  describe('with empty players array', () => {
    it('should return empty array', () => {
      const players: string[][] = []

      const result = assignScoresByRank(players)

      expect(result.length).toBe(0)
      expect(result).toEqual([])
    })
  })

  describe('with single player', () => {
    it('should assign score of 0', () => {
      const players = [['Alice']]

      const result = assignScoresByRank(players)

      expect(result.length).toBe(1)
      expect(result).toEqual([{ playerName: 'Alice', value: 0 }])
    })
  })

  describe('with multiple players in first rank', () => {
    it('should assign score of 1 to first rank, 0 to others', () => {
      const players = [['Alice'], ['Bob', 'Charlie']]

      const result = assignScoresByRank(players)

      expect(result.length).toBe(3)

      expect(result).toEqual([
        { playerName: 'Alice', value: 1 },
        { playerName: 'Bob', value: 0 },
        { playerName: 'Charlie', value: 0 },
      ])
    })
  })

  describe('with three players in last rank', () => {
    it('should assign 1 point to all players in first rank, 0 to last', () => {
      const players = [['Alice', 'Bob', 'Charlie'], ['Dave']]

      const result = assignScoresByRank(players)

      expect(result.length).toBe(4)
      expect(result).toEqual([
        { playerName: 'Alice', value: 1 },
        { playerName: 'Bob', value: 1 },
        { playerName: 'Charlie', value: 1 },
        { playerName: 'Dave', value: 0 },
      ])
    })
  })

  describe('with multiple groups', () => {
    it('should assign scores based on rank groups', () => {
      const players = [
        ['Alice', 'Bob', 'Charlie', 'Dave'],
        ['Eve', 'Frank'],
      ]

      const result = assignScoresByRank(players)

      expect(result.length).toBe(6)
      expect(result).toEqual([
        { playerName: 'Alice', value: 1 },
        { playerName: 'Bob', value: 1 },
        { playerName: 'Charlie', value: 1 },
        { playerName: 'Dave', value: 1 },
        { playerName: 'Eve', value: 0 },
        { playerName: 'Frank', value: 0 },
      ])
    })
  })
})
