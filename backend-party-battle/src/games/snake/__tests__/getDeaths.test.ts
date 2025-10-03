import { Cell, CellKind } from 'types-party-battle/types/snake/CellSchema'
import { getDeaths } from '../getDeaths'
import { MovementIntention } from '../getMovementIntention'

describe('getDeaths', () => {
  describe('when there is 1 snake with length 2 moving right', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, 'player1'], [CellKind.Snake, 'player1'], CellKind.Empty],
    ])
    const width = 3
    const height = 2

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 2, y: 1 }, tail: 3, direction: 'right' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake with length 1 moving right', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, 'player1'], CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 0, y: 1 }, tail: 2, direction: 'right' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there are 2 snakes moving to the same field', () => {
    const board = createBoard([[[CellKind.Snake, 'player1'], CellKind.Empty, [CellKind.Snake, 'player2']]])
    const width = 3
    const height = 1

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 1, y: 0 }, tail: 0, direction: 'right' },
      player2: { head: { x: 1, y: 0 }, tail: 2, direction: 'left' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark both snakes as dead', () => {
      expect(deaths).toEqual(new Set(['player1', 'player2']))
    })
  })

  describe('when there are 2 snakes moving independently', () => {
    const board = createBoard([
      [[CellKind.Snake, 'player1'], CellKind.Empty, [CellKind.Snake, 'player2']],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
      [CellKind.Empty, CellKind.Empty, CellKind.Empty],
    ])
    const width = 3
    const height = 3

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 1, y: 0 }, tail: 0, direction: 'right' },
      player2: { head: { x: 2, y: 1 }, tail: 2, direction: 'down' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })

  describe('when there is 1 snake moving out of the map right', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, 'player1']],
      [CellKind.Empty, CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 2, y: 0 }, tail: 1, direction: 'right' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['player1']))
    })
  })

  describe('when there is 1 snake moving out of the map bottom', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, 'player1'], CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 1, y: 2 }, tail: 2, direction: 'down' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['player1']))
    })
  })

  describe('when there is 1 snake moving out of the map left', () => {
    const board = createBoard([
      [CellKind.Empty, CellKind.Empty],
      [[CellKind.Snake, 'player1'], CellKind.Empty],
    ])
    const width = 2
    const height = 1

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: -1, y: 1 }, tail: 3, direction: 'left' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['player1']))
    })
  })

  describe('when there is 1 snake moving out of the map top', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, 'player1']],
      [CellKind.Empty, CellKind.Empty],
    ])
    const width = 2
    const height = 2

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 1, y: -1 }, tail: 1, direction: 'up' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should mark snake as dead', () => {
      expect(deaths).toEqual(new Set(['player1']))
    })
  })

  describe('when there is 1 snake moving onto its own tail', () => {
    const board = createBoard([
      [CellKind.Empty, [CellKind.Snake, 'player1'], [CellKind.Empty, 'player1']],
      [CellKind.Snake, [CellKind.Empty, 'player1'], [CellKind.Empty, 'player1']],
    ])
    const width = 3
    const height = 3

    const intentions: Record<string, MovementIntention> = {
      player1: { head: { x: 2, y: 0 }, tail: 2, direction: 'right' },
    }
    const deaths = getDeaths(intentions, board, width, height)

    it('should have no deaths', () => {
      expect(deaths).toEqual(new Set())
    })
  })
})

function createBoard(board2D: (CellKind | [CellKind, string, boolean?])[][]): Cell[] {
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
