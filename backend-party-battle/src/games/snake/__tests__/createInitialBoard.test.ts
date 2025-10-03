import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { createInitialBoard } from '../createInitialBoard'

describe('createInitialBoard', () => {
  describe('when there are 2 players', () => {
    const players = ['1', '2']
    const result = createInitialBoard(players)

    it('should create a board with correct size', () => {
      expect(result.width).toBe(20)
      expect(result.height).toBe(10)
      expect(result.board).toHaveLength(20 * 10)
    })

    it('should create correct directions', () => {
      expect(result.directions).toEqual<Record<string, Direction>>({
        '1': 'right',
        '2': 'left',
      })
    })

    it('should create correct bodies', () => {
      expect(result.bodies).toEqual<Record<string, number[]>>({
        '1': [40, 41, 42, 43], // y=2, x=0-3, faces right
        '2': [159, 158, 157, 156], // y=7, x=16-19, faces left (reversed)
      })
    })

    it('should create correct board', () => {
      // prettier-ignore
      const expectedBoard2D: (CellKind | [CellKind, string, boolean?])[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '1', false], [1, '1', false], [1, '1', false], [1, '1', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '2', true], [1, '2', false], [1, '2', false], [1, '2', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]
      const expectedBoard = convertBoard2DToCells(expectedBoard2D)

      expect(result.board).toEqual(expectedBoard)
    })
  })

  describe('when there are 3 players', () => {
    const players = ['1', '2', '3']
    const result = createInitialBoard(players)

    it('should create a board with correct size', () => {
      expect(result.width).toBe(20)
      expect(result.height).toBe(15)
      expect(result.board).toHaveLength(20 * 15)
    })

    it('should create correct directions', () => {
      expect(result.directions).toEqual<Record<string, Direction>>({
        '1': 'right',
        '2': 'left',
        '3': 'right',
      })
    })

    it('should create correct bodies', () => {
      expect(result.bodies).toEqual<Record<string, number[]>>({
        '1': [40, 41, 42, 43], // y=2, x=0-3, faces right
        '2': [159, 158, 157, 156], // y=7, x=16-19, faces left (reversed)
        '3': [240, 241, 242, 243], // y=12, x=0-3, faces right
      })
    })

    it('should create correct board', () => {
      // prettier-ignore
      const expectedBoard2D: (CellKind | [CellKind, string, boolean?])[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '1', false], [1, '1', false], [1, '1', false], [1, '1', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '2', true], [1, '2', false], [1, '2', false], [1, '2', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '3', false], [1, '3', false], [1, '3', false], [1, '3', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]

      const expectedBoard = convertBoard2DToCells(expectedBoard2D)

      expect(result.board).toEqual(expectedBoard)
    })
  })

  describe('when there are 8 players', () => {
    const players = ['1', '2', '3', '4', '5', '6', '7', '8']
    const result = createInitialBoard(players)

    it('should create a board with correct size', () => {
      expect(result.width).toBe(20)
      expect(result.height).toBe(40)
      expect(result.board).toHaveLength(20 * 40)
    })

    it('should create correct directions', () => {
      expect(result.directions).toEqual<Record<string, Direction>>({
        '1': 'right',
        '2': 'left',
        '3': 'right',
        '4': 'left',
        '5': 'right',
        '6': 'left',
        '7': 'right',
        '8': 'left',
      })
    })

    it('should create correct bodies', () => {
      expect(result.bodies).toEqual<Record<string, number[]>>({
        '1': [40, 41, 42, 43], // y=2, x=0-3, faces right
        '2': [159, 158, 157, 156], // y=7, x=16-19, faces left (reversed)
        '3': [240, 241, 242, 243], // y=12, x=0-3, faces right
        '4': [359, 358, 357, 356], // y=17, x=16-19, faces left (reversed)
        '5': [440, 441, 442, 443], // y=22, x=0-3, faces right
        '6': [559, 558, 557, 556], // y=27, x=16-19, faces left (reversed)
        '7': [640, 641, 642, 643], // y=32, x=0-3, faces right
        '8': [759, 758, 757, 756], // y=37, x=16-19, faces left (reversed)
      })
    })

    it('should create correct board', () => {
      // prettier-ignore
      const expectedBoard2D: (CellKind | [CellKind, string, boolean?])[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '1', false], [1, '1', false], [1, '1', false], [1, '1', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '2', true], [1, '2', false], [1, '2', false], [1, '2', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '3', false], [1, '3', false], [1, '3', false], [1, '3', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '4', true], [1, '4', false], [1, '4', false], [1, '4', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '5', false], [1, '5', false], [1, '5', false], [1, '5', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '6', true], [1, '6', false], [1, '6', false], [1, '6', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [[1, '7', false], [1, '7', false], [1, '7', false], [1, '7', true], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [1, '8', true], [1, '8', false], [1, '8', false], [1, '8', false]],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]

      const expectedBoard = convertBoard2DToCells(expectedBoard2D)

      expect(result.board).toEqual(expectedBoard)
    })
  })
})

function convertBoard2DToCells(board2D: (CellKind | [CellKind, string, boolean?])[][]): Cell[] {
  const cells: Cell[] = []
  board2D.forEach((row) => {
    row.forEach((cell) => {
      if (Array.isArray(cell)) {
        const [kind, player, isHead] = cell
        cells.push({ kind, player, isHead })
      } else {
        cells.push({ kind: cell })
      }
    })
  })
  return cells
}
