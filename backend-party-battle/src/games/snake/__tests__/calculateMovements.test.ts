import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { Direction, RemainingPlayer } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { calculateMovements } from '../calculateMovements'

describe('calculateMovements', () => {
  describe('when there is 1 snake with length 2 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [3, 4]]])
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], [CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 3
    const height = 2

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should create correct intentions', () => {
      expect(result.intentions).toEqual([{ name: '1', next: 5, tail: 3 }])
    })

    it('should have no deaths', () => {
      expect(result.deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake with length 1 moving right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [2]]])
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should create correct intentions', () => {
      expect(result.intentions).toEqual([{ name: '1', next: 3, tail: 2 }])
    })

    it('should have no deaths', () => {
      expect(result.deaths).toEqual(new Set())
    })
  })

  describe('when there are 2 snakes moving to the same field', () => {
    const remainingPlayers: RemainingPlayer[] = [
      { name: '1', direction: Direction.Right },
      { name: '2', direction: Direction.Left },
    ]
    const bodies = new Map([
      ['1', [0]],
      ['2', [2]],
    ])
    const board = createBoard([[[CellKind.Snake, '1'], CellKind.Empty, [CellKind.Snake, '2']]])
    const width = 3
    const height = 1

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should have no intentions for dead snakes', () => {
      expect(result.intentions).toEqual([])
    })

    it('should mark both snakes as dead', () => {
      expect(result.deaths).toEqual(new Set(['1', '2']))
    })
  })

  describe('when there are 2 snakes moving independently', () => {
    const remainingPlayers: RemainingPlayer[] = [
      { name: '1', direction: Direction.Right },
      { name: '2', direction: Direction.Down },
    ]
    const bodies = new Map([
      ['1', [0]],
      ['2', [2]],
    ])
    const board = createBoard([
      [[CellKind.Snake, '1'], CellKind.Empty, [CellKind.Snake, '2']],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
    ])
    const width = 3
    const height = 3

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should create correct intentions', () => {
      expect(result.intentions).toEqual([
        { name: '1', next: 1, tail: 0 },
        { name: '2', next: 5, tail: 2 },
      ])
    })

    it('should have no deaths', () => {
      expect(result.deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake moving out of the map right', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [1]]])
    const board = createBoard([[CellKind.Empty, [CellKind.Snake, '1']]])
    const width = 2
    const height = 1

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should have no intentions', () => {
      expect(result.intentions).toEqual([])
    })

    it('should mark snake as dead', () => {
      expect(result.deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map bottom', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Down }]
    const bodies = new Map([['1', [2]]])
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [CellKind.Empty, [CellKind.Snake, '1']],
    ])
    const width = 2
    const height = 2

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should have no intentions', () => {
      expect(result.intentions).toEqual([])
    })

    it('should mark snake as dead', () => {
      expect(result.deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map left', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Left }]
    const bodies = new Map([['1', [0]]])
    const board = createBoard([[[CellKind.Snake, '1'], CellKind.Empty]])
    const width = 2
    const height = 1

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should have no intentions', () => {
      expect(result.intentions).toEqual([])
    })

    it('should mark snake as dead', () => {
      expect(result.deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map top', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Up }]
    const bodies = new Map([['1', [0]]])
    const board = createBoard([
      [[CellKind.Snake, '1'], CellKind.Empty],
      [CellKind.Empty, CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should have no intentions', () => {
      expect(result.intentions).toEqual([])
    })

    it('should mark snake as dead', () => {
      expect(result.deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving onto its own tail', () => {
    const remainingPlayers: RemainingPlayer[] = [{ name: '1', direction: Direction.Right }]
    const bodies = new Map([['1', [2, 4, 5, 1]]])
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, '1'], [CellKind.Empty, '1']],
      [CellKind.Snake, [CellKind.Empty, '1'], [CellKind.Empty, '1']],
    ])
    const width = 3
    const height = 3

    const result = calculateMovements(remainingPlayers, bodies, board, width, height)

    it('should create correct intentions', () => {
      expect(result.intentions).toEqual([{ name: '1', next: 2, tail: 2 }])
    })

    it('should have no deaths', () => {
      expect(result.deaths).toEqual(new Set())
    })
  })
})

function createBoard(board2D: (CellKind | [CellKind, string])[][]): Cell[] {
  const cells: Cell[] = []
  board2D.forEach((row) => {
    row.forEach((cell) => {
      if (Array.isArray(cell)) {
        const [kind, player] = cell
        cells.push({ kind, player })
      } else {
        cells.push({ kind: cell })
      }
    })
  })
  return cells
}
