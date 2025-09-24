import { isOppositeDirection } from '../isOppositeDirection'

describe('isOppositeDirection', () => {
  describe('when directions are opposite', () => {
    it('should return true for up and down', () => {
      expect(isOppositeDirection('up', 'down')).toBe(true)
    })

    it('should return true for down and up', () => {
      expect(isOppositeDirection('down', 'up')).toBe(true)
    })

    it('should return true for left and right', () => {
      expect(isOppositeDirection('left', 'right')).toBe(true)
    })

    it('should return true for right and left', () => {
      expect(isOppositeDirection('right', 'left')).toBe(true)
    })
  })

  describe('when directions are the same', () => {
    it('should return false for up and up', () => {
      expect(isOppositeDirection('up', 'up')).toBe(false)
    })

    it('should return false for down and down', () => {
      expect(isOppositeDirection('down', 'down')).toBe(false)
    })

    it('should return false for left and left', () => {
      expect(isOppositeDirection('left', 'left')).toBe(false)
    })

    it('should return false for right and right', () => {
      expect(isOppositeDirection('right', 'right')).toBe(false)
    })
  })

  describe('when directions are adjacent but not opposite', () => {
    it('should return false for up and left', () => {
      expect(isOppositeDirection('up', 'left')).toBe(false)
    })

    it('should return false for up and right', () => {
      expect(isOppositeDirection('up', 'right')).toBe(false)
    })

    it('should return false for down and left', () => {
      expect(isOppositeDirection('down', 'left')).toBe(false)
    })

    it('should return false for down and right', () => {
      expect(isOppositeDirection('down', 'right')).toBe(false)
    })

    it('should return false for left and up', () => {
      expect(isOppositeDirection('left', 'up')).toBe(false)
    })

    it('should return false for left and down', () => {
      expect(isOppositeDirection('left', 'down')).toBe(false)
    })

    it('should return false for right and up', () => {
      expect(isOppositeDirection('right', 'up')).toBe(false)
    })

    it('should return false for right and down', () => {
      expect(isOppositeDirection('right', 'down')).toBe(false)
    })
  })
})
