import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { getDeaths } from '../getDeaths'
import { MovementIntention } from '../getMovementIntentions'

describe('getDeaths', () => {
  describe('when there is 1 snake with length 2 moving right', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], [CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 3
    const height = 2

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 2, y: 1 }, tail: 3 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake with length 1 moving right', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 0, y: 1 }, tail: 2 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there are 2 snakes moving to the same field', () => {
    const board = createBoard([[[CellKind.Snake, '1'], CellKind.Empty, [CellKind.Snake, '2']]])
    const width = 3
    const height = 1

    const intentions: MovementIntention[] = [
      { name: '1', head: { x: 1, y: 0 }, tail: 0 },
      { name: '2', head: { x: 1, y: 0 }, tail: 2 },
    ]
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark both snakes as dead', () => {
      expect(deaths).toEqual(new Set(['1', '2']))
    })
  })

  describe('when there are 2 snakes moving independently', () => {
    const board = createBoard([
      [[CellKind.Snake, '1'], CellKind.Empty, [CellKind.Snake, '2']],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
    ])
    const width = 3
    const height = 3

    const intentions: MovementIntention[] = [
      { name: '1', head: { x: 1, y: 0 }, tail: 0 },
      { name: '2', head: { x: 2, y: 1 }, tail: 2 },
    ]
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake moving out of the map right', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, '1']],
      [CellKind.Empty, CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 2, y: 0 }, tail: 1 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map bottom', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 1, y: 2 }, tail: 2 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map left', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, '1'], CellKind.Empty],
    ])
    const width = 2
    const height = 1

    const intentions: MovementIntention[] = [{ name: '1', head: { x: -1, y: 1 }, tail: 3 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving out of the map top', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, '1']],
      [CellKind.Empty, CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 1, y: -1 }, tail: 1 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['1']))
    })
  })

  describe('when there is 1 snake moving onto its own tail', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, '1'], [CellKind.Empty, '1']],
      [CellKind.Snake, [CellKind.Empty, '1'], [CellKind.Empty, '1']],
    ])
    const width = 3
    const height = 3

    const intentions: MovementIntention[] = [{ name: '1', head: { x: 2, y: 0 }, tail: 2 }]
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
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
