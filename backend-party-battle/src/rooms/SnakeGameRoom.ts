import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellKind, CellSchema, fromCell, toCell } from 'types-party-battle/types/snake/CellSchema'
import {
  RemainingPlayerSchema,
  toRemainingPlayer,
} from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { getDeaths } from '../games/snake/getDeaths'
import { getIntentions } from '../games/snake/getIntentions'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

const STEPS_PER_SECOND = 3

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[][] = []
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
    const board = this.state.board

    const intentions = getIntentions(
      this.state.remainingPlayers.map(toRemainingPlayer),
      this.bodies,
      this.state.width
    )
    const deaths = getDeaths(intentions, board.map(toCell), this.state.width, this.state.height)

    for (const intention of intentions) {
      if (deaths.has(intention.name)) continue
      const body = this.bodies.get(intention.name)
      if (!body || body.length === 0) continue
      const tailIndex = body[0]
      const headIndex = intention.head.y * this.state.width + intention.head.x
      const tailCell = board[tailIndex]
      tailCell.kind = CellKind.Empty
      tailCell.player = undefined
      body.push(headIndex)
      body.shift()
      const headCell = board[headIndex]
      headCell.kind = CellKind.Snake
      headCell.player = intention.name
    }

    if (deaths.size > 0) {
      const names = Array.from(deaths)
      const eliminatedThisTurn: string[] = []

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
        eliminatedThisTurn.push(name)
      }

      this.eliminatedPlayers.push(eliminatedThisTurn)
    }

    if (this.state.remainingPlayers.length <= 1) {
      this.finishGame()
    }
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = [...this.eliminatedPlayers]

    playerGroups.push([...this.state.remainingPlayers.map((player) => player.name)])

    return assignScoresByOrder(playerGroups)
  }
}
