import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellKind, CellSchema, fromCell } from 'types-party-battle/types/snake/CellSchema'
import { Direction, RemainingPlayerSchema } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

const STEPS_PER_SECOND = 3

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[] = []
  private bodies: Map<string, number[]> = new Map()

  override getGameType(): GameType {
    return SnakeGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: string }[] }) {
    const playerNames = options.players.map((player) => player.name)
    const { board, width, height, directions, bodies } = createInitialBoard(playerNames)
    this.bodies = bodies

    const boardSchema = new ArraySchema<CellSchema>()
    board.forEach((cell) => {
      boardSchema.push(fromCell(cell))
    })

    this.state = new SnakeGameSchema('waiting', width, height, boardSchema)

    super.onCreate(options)

    playerNames.forEach((playerName) => {
      const remainingPlayerSchema = new RemainingPlayerSchema(playerName, directions[playerName])
      this.state.remainingPlayers.push(remainingPlayerSchema)
    })

    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / STEPS_PER_SECOND)
  }

  update(_deltaTime: number) {
    const width = this.state.width
    const height = this.state.height
    const board = this.state.board

    const intentions: { name: string; next: number; tail: number }[] = []
    const deaths = new Set<string>()

    const dxdy = (d: Direction): [number, number] => {
      if (d === Direction.Up) return [0, -1]
      if (d === Direction.Down) return [0, 1]
      if (d === Direction.Left) return [-1, 0]
      return [1, 0]
    }

    for (const rp of this.state.remainingPlayers) {
      const body = this.bodies.get(rp.name)
      if (!body || body.length === 0) {
        deaths.add(rp.name)
        continue
      }
      const headIndex = body[body.length - 1]
      const x = headIndex % width
      const y = Math.floor(headIndex / width)
      const [dx, dy] = dxdy(rp.direction)
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        deaths.add(rp.name)
        continue
      }
      const nextIndex = ny * width + nx
      const isOwnTail = nextIndex === body[0]
      const cell = board[nextIndex]
      if (cell.kind === CellKind.Snake && !isOwnTail) {
        deaths.add(rp.name)
        continue
      }
      intentions.push({ name: rp.name, next: nextIndex, tail: body[0] })
    }

    const targets = new Map<number, string[]>()
    for (const i of intentions) {
      const arr = targets.get(i.next)
      if (arr) arr.push(i.name)
      else targets.set(i.next, [i.name])
    }

    for (const [idx, names] of targets) {
      if (names.length >= 2 && board[idx].kind === CellKind.Empty) {
        for (const n of names) deaths.add(n)
      }
    }

    for (const i of intentions) {
      if (deaths.has(i.name)) continue
      const body = this.bodies.get(i.name)
      if (!body || body.length === 0) continue
      const tailIndex = body[0]
      const headIndex = i.next
      const tailCell = board[tailIndex]
      tailCell.kind = CellKind.Empty
      tailCell.player = undefined
      body.push(headIndex)
      body.shift()
      const headCell = board[headIndex]
      headCell.kind = CellKind.Snake
      headCell.player = i.name
    }

    if (deaths.size > 0) {
      const names = Array.from(deaths)
      for (const name of names) {
        const body = this.bodies.get(name)
        if (body) {
          for (const idx of body) {
            const c = board[idx]
            c.kind = CellKind.Empty
            c.player = undefined
          }
          this.bodies.delete(name)
        }
        for (let i = 0; i < this.state.remainingPlayers.length; i++) {
          if (this.state.remainingPlayers[i].name === name) {
            this.state.remainingPlayers.splice(i, 1)
            break
          }
        }
        this.eliminatedPlayers.push(name)
      }
    }

    if (this.state.remainingPlayers.length <= 1) {
      this.finishGame()
    }
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = []

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([playerName])
    }

    playerGroups.push([...this.state.remainingPlayers.map((player) => player.name)])

    return assignScoresByOrder(playerGroups)
  }
}
